import type { GenerateOptions } from "../runanywhere/types";

const GROQ_PROXY_URL = import.meta.env.VITE_GROQ_PROXY_URL?.trim() || "/api/groq";

export function isGroqProxyAvailable() {
  return import.meta.env.DEV || Boolean(import.meta.env.VITE_GROQ_PROXY_URL);
}

type GroqResponse = {
  output_text?: string;
  model?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

function extractOutputText(payload: GroqResponse) {
  if (typeof payload.output_text === "string" && payload.output_text.trim().length > 0) {
    return payload.output_text;
  }

  const fragments =
    payload.output
      ?.flatMap((item) => item.content ?? [])
      .filter((item) => item.type === "output_text" && typeof item.text === "string")
      .map((item) => item.text ?? "") ?? [];

  return fragments.join("\n").trim();
}

export async function generateWithGroq(
  prompt: string,
  options?: GenerateOptions,
  onToken?: (nextText: string) => void
) {
  const startedAt = performance.now();
  const response = await fetch(GROQ_PROXY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      input: prompt,
      temperature: options?.temperature ?? 0.3,
      max_output_tokens: options?.maxTokens ?? 320
    })
  });

  const payload = (await response.json()) as GroqResponse & {
    error?: {
      message?: string;
    };
  };

  if (!response.ok) {
    throw new Error(payload.error?.message ?? "Groq request failed.");
  }

  const text = extractOutputText(payload);

  if (!text) {
    throw new Error("Groq returned an empty response.");
  }

  onToken?.(text);

  return {
    text,
    model: payload.model ?? null,
    latencyMs: performance.now() - startedAt
  };
}
