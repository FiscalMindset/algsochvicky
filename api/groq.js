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
    const groqRes = await fetch("https://api.groq.com/openai/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...normalizePayload(req.body),
        stream: req.body?.stream ?? false
      })
    });

    res.status(groqRes.status);
    groqRes.headers.forEach((value, key) => res.setHeader(key, value));
    if (groqRes.body) {
      const reader = groqRes.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) { res.end(); break; }
        res.write(value);
      }
    } else {
      res.end();
    }
  } catch (error) {
    res.status(500).json({
      error: {
        message: error instanceof Error ? error.message : "Groq proxy request failed."
      }
    });
  }
}
