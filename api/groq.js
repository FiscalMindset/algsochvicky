const DEFAULT_GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

function normalizePayload(body) {
  const payload = typeof body === "string" ? JSON.parse(body || "{}") : body || {};

  return {
    model: payload.model || DEFAULT_GROQ_MODEL,
    input: payload.input,
    instructions: payload.instructions,
    temperature: payload.temperature,
    max_output_tokens: payload.max_output_tokens
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: { message: "Method not allowed." } });
    return;
  }

  if (!process.env.GROQ_API_KEY) {
    res.status(503).json({
      error: {
        message: "GROQ_API_KEY is not configured on the server."
      }
    });
    return;
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(normalizePayload(req.body))
    });

    const bodyText = await response.text();
    res.status(response.status);
    res.setHeader("Content-Type", response.headers.get("content-type") ?? "application/json");
    res.send(bodyText);
  } catch (error) {
    res.status(500).json({
      error: {
        message: error instanceof Error ? error.message : "Groq proxy request failed."
      }
    });
  }
}
