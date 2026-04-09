type RunAnywhereCoreModule = typeof import("@runanywhere/web");
type RunAnywhereLlamaModule = typeof import("@runanywhere/web-llamacpp");

export type RunAnywhereModules = {
  core: RunAnywhereCoreModule;
  llm: RunAnywhereLlamaModule;
};

let modulesPromise: Promise<RunAnywhereModules> | null = null;

export async function loadRunAnywhereModules(): Promise<RunAnywhereModules> {
  if (!modulesPromise) {
    modulesPromise = Promise.all([import("@runanywhere/web"), import("@runanywhere/web-llamacpp")]).then(
      ([core, llm]) => ({ core, llm })
    );
  }

  return modulesPromise;
}
