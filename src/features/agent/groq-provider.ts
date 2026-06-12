import type { GenerateOptions } from "../runanywhere/types";

const GROQ_PROXY_URL = import.meta.env.VITE_GROQ_PROXY_URL?.trim() || "/api/groq";

export function isGroqProxyAvailable() {
  return import.meta.env.DEV || Boolean(import.meta.env.VITE_GROQ_PROXY_URL);
}

function parseSSEBuffer(buffer: string): { events: { event: string; data: string }[]; remainder: string } {
  const events: { event: string; data: string }[] = [];
  const lines = buffer.split("\n");
  let currentEvent = "";
  let currentData = "";
  let i = 0;

  for (; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("event: ")) {
      currentEvent = line.slice(7).trim();
    } else if (line.startsWith("data: ")) {
      currentData = line.slice(6).trim();
    } else if (line === "" && currentData) {
      events.push({ event: currentEvent, data: currentData });
      currentEvent = "";
      currentData = "";
    } else if (line === "" && !currentData) {
      currentEvent = "";
    }
  }

  const remainder = lines.slice(i - 1).join("\n");
  return { events, remainder };
}

export async function generateWithGroq(
  prompt: string,
  options?: GenerateOptions,
  onToken?: (nextText: string) => void
) {
  const startedAt = performance.now();
  const response = await fetch(GROQ_PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: prompt,
      temperature: options?.temperature ?? 0.3,
      max_output_tokens: options?.maxTokens ?? 320,
      stream: true
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message ?? "Groq request failed.");
  }

  const contentType = response.headers.get("content-type") ?? "";
  const isStreaming = contentType.includes("text/event-stream") || contentType.includes("application/x-ndjson");

  if (!isStreaming || !response.body) {
    const payload = await response.json();
    const fullText = extractOutputText(payload);
    if (!fullText) throw new Error("Groq returned an empty response.");
    onToken?.(fullText);
    return {
      text: fullText,
      model: payload.model ?? null,
      latencyMs: performance.now() - startedAt
    };
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let accumulated = "";
  let resolvedModel: string | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const { events, remainder } = parseSSEBuffer(buffer);
    buffer = remainder;

    for (const evt of events) {
      if (evt.event === "response.output_text.delta") {
        try {
          const data = JSON.parse(evt.data);
          const delta = data.delta ?? "";
          if (delta) {
            accumulated += delta;
            onToken?.(accumulated);
          }
        } catch {}
      } else if (evt.event === "response.output_text.done") {
        try {
          const data = JSON.parse(evt.data);
          if (data.model) resolvedModel = data.model;
        } catch {}
      } else if (evt.event === "done") {
        try {
          const data = JSON.parse(evt.data);
          if (data.model) resolvedModel = data.model;
        } catch {}
      }
    }
  }

  if (!accumulated) {
    throw new Error("Groq returned an empty response.");
  }

  return {
    text: accumulated,
    model: resolvedModel,
    latencyMs: performance.now() - startedAt
  };
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
