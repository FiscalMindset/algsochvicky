import { createServer } from "node:http";

const PORT = Number(process.env.PORT || 10000);
const DEFAULT_GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

function setCorsHeaders(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(response, statusCode, payload) {
  setCorsHeaders(response);
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(payload));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk.toString();
    });

    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    setCorsHeaders(response);
    response.statusCode = 204;
    response.end();
    return;
  }

  if (request.url === "/health") {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.url !== "/api/groq" || request.method !== "POST") {
    sendJson(response, 404, { error: { message: "Not found." } });
    return;
  }

  if (!process.env.GROQ_API_KEY) {
    sendJson(response, 503, {
      error: {
        message: "GROQ_API_KEY is not configured on the server."
      }
    });
    return;
  }

  try {
    const rawBody = await readBody(request);
    const payload = rawBody ? JSON.parse(rawBody) : {};

    const upstream = await fetch("https://api.groq.com/openai/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: payload.model || DEFAULT_GROQ_MODEL,
        input: payload.input,
        instructions: payload.instructions,
        temperature: payload.temperature,
        max_output_tokens: payload.max_output_tokens
      })
    });

    const text = await upstream.text();
    setCorsHeaders(response);
    response.statusCode = upstream.status;
    response.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
    response.end(text);
  } catch (error) {
    sendJson(response, 500, {
      error: {
        message: error instanceof Error ? error.message : "Groq proxy request failed."
      }
    });
  }
}).listen(PORT);
