export type LocalModelStatus = "not-downloaded" | "downloading" | "ready" | "loading" | "active" | "failed";

export type RuntimeSnapshot = {
  sdkReady: boolean;
  initializing: boolean;
  modelStatus: LocalModelStatus;
  progress: number;
  detail: string;
  cached: boolean;
  accelerationMode: string;
  crossOriginIsolated: boolean;
  memoryRequirement: number;
  lastError: string | null;
  lastMetrics: {
    tokensUsed: number;
    tokensPerSecond: number;
    latencyMs: number;
  } | null;
};

export type GenerateOptions = {
  maxTokens?: number;
  temperature?: number;
};

export type RuntimeBridge = {
  activate: () => Promise<void>;
  release: () => Promise<void>;
  clearCache: () => Promise<void>;
  generate: (
    prompt: string,
    options?: GenerateOptions,
    onToken?: (nextText: string, token: string) => void
  ) => Promise<{
    text: string;
    tokensUsed: number;
    tokensPerSecond: number;
    latencyMs: number;
  }>;
};
