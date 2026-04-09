import type { RuntimeBridge } from "../runanywhere/types";

export type AgentMode = "auto" | "recruiter" | "client" | "technical" | "project" | "capability";

export type AgentIntent = Exclude<AgentMode, "auto">;

export type AgentInferenceMode = "auto" | "groq" | "local" | "fallback";

export type AgentProvider = "groq" | "local" | "fallback";

export type AgentResponse = {
  mode: AgentIntent;
  modeLabel: string;
  answer: string;
  usedLocalModel: boolean;
  provider: AgentProvider;
  providerLabel: string;
  providerModel: string | null;
  recommendedSystems: string[];
  evidence: {
    title: string;
    summary: string;
  }[];
  reasoning: string[];
  followUps: string[];
};

export type AgentRequest = {
  query: string;
  mode: AgentMode;
  inferenceMode?: AgentInferenceMode;
  runtime?: RuntimeBridge | null;
  onToken?: (nextText: string) => void;
};
