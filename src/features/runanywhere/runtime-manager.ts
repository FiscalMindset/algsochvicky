import { localLanguageModel } from "./model-catalog";
import { loadRunAnywhereModules, type RunAnywhereModules } from "./sdk";
import type { GenerateOptions, RuntimeBridge, RuntimeSnapshot } from "./types";

const initialSnapshot: RuntimeSnapshot = {
  sdkReady: false,
  initializing: false,
  modelStatus: "not-downloaded",
  progress: 0,
  detail: "Local runtime inactive",
  cached: false,
  accelerationMode: "unknown",
  crossOriginIsolated: typeof window !== "undefined" ? window.crossOriginIsolated : false,
  memoryRequirement: localLanguageModel.memoryRequirement,
  lastError: null,
  lastMetrics: null
};

type Listener = (snapshot: RuntimeSnapshot) => void;

class RunAnywhereRuntimeManager implements RuntimeBridge {
  private snapshot = initialSnapshot;
  private listeners = new Set<Listener>();
  private initialized = false;
  private initializePromise: Promise<void> | null = null;
  private eventsBound = false;

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    listener(this.snapshot);
    return () => this.listeners.delete(listener);
  }

  getSnapshot() {
    return this.snapshot;
  }

  async initialize() {
    if (this.initializePromise) {
      return this.initializePromise;
    }

    this.setSnapshot({
      initializing: true,
      detail: "Preparing RunAnywhere runtime",
      lastError: null
    });

    this.initializePromise = (async () => {
      try {
        const modules = await loadRunAnywhereModules();
        await modules.core.RunAnywhere.initialize({
          environment: modules.core.SDKEnvironment.Production,
          debug: false
        });

        await modules.llm.LlamaCPP.register();
        this.registerModelCatalog(modules);
        this.bindEvents(modules);
        this.initialized = true;
        this.syncFromRegistry(modules);
      } catch (error) {
        this.initialized = false;
        this.setSnapshot({
          sdkReady: false,
          initializing: false,
          modelStatus: "failed",
          detail: "Local runtime failed to initialize",
          lastError: error instanceof Error ? error.message : "Unknown runtime error"
        });
        throw error;
      } finally {
        this.initializePromise = null;
      }
    })();

    return this.initializePromise;
  }

  async activate() {
    await this.initialize();
    const modules = await loadRunAnywhereModules();
    const model = this.findModel(modules);

    if (!model) {
      throw new Error("RunAnywhere model catalog registration failed.");
    }

    if (model.status !== "downloaded" && model.status !== "loaded") {
      this.setSnapshot({
        modelStatus: "downloading",
        progress: 0,
        detail: "Downloading model to browser cache"
      });

      await modules.core.ModelManager.downloadModel(localLanguageModel.id);
    }

    this.setSnapshot({
      modelStatus: "loading",
      progress: 1,
      detail: "Loading model into local inference runtime"
    });

    await modules.core.ModelManager.loadModel(localLanguageModel.id);
    this.syncFromRegistry(modules, "Local model active for on-device answers");
  }

  async release() {
    await this.initialize();
    const modules = await loadRunAnywhereModules();
    const lifecycle = modules.core.RunAnywhere as unknown as {
      cleanup?: () => Promise<void> | void;
      reset?: () => Promise<void> | void;
    };

    this.setSnapshot({
      modelStatus: this.snapshot.cached ? "ready" : "not-downloaded",
      detail: "Releasing local runtime",
      lastError: null
    });

    if (typeof lifecycle.cleanup === "function") {
      await lifecycle.cleanup();
    } else if (typeof lifecycle.reset === "function") {
      await lifecycle.reset();
      this.initialized = false;
      await this.initialize();
      return;
    }

    this.syncFromRegistry(modules, this.snapshot.cached ? "Model cached and ready to reactivate" : "Local runtime inactive");
  }

  async clearCache() {
    await this.initialize();
    const modules = await loadRunAnywhereModules();

    this.setSnapshot({
      modelStatus: "loading",
      detail: "Clearing cached model from browser storage",
      progress: 0
    });

    await modules.core.ModelManager.deleteModel(localLanguageModel.id);
    this.setSnapshot({
      modelStatus: "not-downloaded",
      progress: 0,
      cached: false,
      detail: "Cache cleared. Model will download again on next activation",
      lastMetrics: null
    });
  }

  async generate(prompt: string, options?: GenerateOptions, onToken?: (nextText: string, token: string) => void) {
    await this.activate();
    const modules = await loadRunAnywhereModules();

    const generation = await modules.llm.TextGeneration.generateStream(prompt, {
      maxTokens: options?.maxTokens ?? 280,
      temperature: options?.temperature ?? 0.35
    });

    let accumulated = "";
    for await (const token of generation.stream) {
      accumulated += token;
      onToken?.(accumulated, token);
    }

    const result = await generation.result;
    this.setSnapshot({
      modelStatus: "active",
      detail: "Local answer complete",
      lastMetrics: {
        tokensUsed: result.tokensUsed,
        tokensPerSecond: result.tokensPerSecond,
        latencyMs: result.latencyMs
      }
    });

    return result;
  }

  private setSnapshot(next: Partial<RuntimeSnapshot>) {
    this.snapshot = {
      ...this.snapshot,
      ...next
    };

    for (const listener of this.listeners) {
      listener(this.snapshot);
    }
  }

  private registerModelCatalog(modules: RunAnywhereModules) {
    const alreadyRegistered = modules.core.ModelManager.getModels().some((entry) => entry.id === localLanguageModel.id);

    if (alreadyRegistered) {
      return;
    }

    modules.core.RunAnywhere.registerModels([
      {
        id: localLanguageModel.id,
        name: localLanguageModel.name,
        repo: localLanguageModel.repo,
        files: [...localLanguageModel.files],
        framework: modules.core.LLMFramework.LlamaCpp,
        modality: modules.core.ModelCategory.Language,
        memoryRequirement: localLanguageModel.memoryRequirement
      }
    ]);
  }

  private bindEvents(modules: RunAnywhereModules) {
    if (this.eventsBound) {
      return;
    }

    this.eventsBound = true;
    modules.core.EventBus.shared.on("model.downloadProgress", (event: { modelId?: string; progress?: number }) => {
      if (event.modelId !== localLanguageModel.id) {
        return;
      }

      this.setSnapshot({
        modelStatus: "downloading",
        progress: event.progress ?? 0,
        detail: `Downloading model ${(event.progress ?? 0) * 100}%`
      });
    });
  }

  private syncFromRegistry(modules: RunAnywhereModules, detail?: string) {
    const model = this.findModel(modules);
    const activeModel = modules.core.ModelManager.getLoadedModel(modules.core.ModelCategory.Language);
    const isActive = activeModel?.id === localLanguageModel.id || model?.status === "loaded";
    const isDownloaded = isActive || model?.status === "downloaded";

    this.setSnapshot({
      sdkReady: true,
      initializing: false,
      cached: Boolean(isDownloaded),
      accelerationMode: modules.llm.LlamaCPP.accelerationMode ?? "unknown",
      crossOriginIsolated: typeof window !== "undefined" ? window.crossOriginIsolated : false,
      modelStatus: isActive ? "active" : isDownloaded ? "ready" : "not-downloaded",
      progress: isDownloaded ? 1 : 0,
      detail:
        detail ??
        (isActive
          ? "Model loaded and ready for local inference"
          : isDownloaded
            ? "Model cached locally in browser storage"
            : "Model not downloaded yet")
    });
  }

  private findModel(modules: RunAnywhereModules) {
    return modules.core.ModelManager.getModels().find((entry) => entry.id === localLanguageModel.id);
  }
}

export const runAnywhereRuntimeManager = new RunAnywhereRuntimeManager();
