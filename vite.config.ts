import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import type { IncomingMessage } from "http";

const __dir = path.dirname(fileURLToPath(import.meta.url));

function readRequestBody(req: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk.toString();
    });

    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function groqDevProxyPlugin(env: Record<string, string>): Plugin {
  return {
    name: "groq-dev-proxy",
    configureServer(server) {
      server.middlewares.use("/api/groq", async (req, res, next) => {
        if (req.method !== "POST") {
          next();
          return;
        }

        if (!env.GROQ_API_KEY) {
          res.statusCode = 503;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: { message: "GROQ_API_KEY is not configured in .env." } }));
          return;
        }

        try {
          const rawBody = await readRequestBody(req);
          const incoming = rawBody ? JSON.parse(rawBody) : {};
          const response = await fetch("https://api.groq.com/openai/v1/responses", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${env.GROQ_API_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: incoming.model || env.GROQ_MODEL || "llama-3.1-8b-instant",
              input: incoming.input,
              instructions: incoming.instructions,
              temperature: incoming.temperature,
              max_output_tokens: incoming.max_output_tokens
            })
          });

          const bodyText = await response.text();
          res.statusCode = response.status;
          res.setHeader("Content-Type", response.headers.get("content-type") ?? "application/json");
          res.end(bodyText);
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              error: {
                message: error instanceof Error ? error.message : "Groq dev proxy request failed."
              }
            })
          );
        }
      });
    }
  };
}

function copyWasmPlugin(): Plugin {
  const llamacppWasm = path.resolve(__dir, "node_modules/@runanywhere/web-llamacpp/wasm");
  const onnxWasm = path.resolve(__dir, "node_modules/@runanywhere/web-onnx/wasm");

  return {
    name: "copy-wasm",
    writeBundle(options) {
      const outDir = options.dir ?? path.resolve(__dir, "dist");
      const assetsDir = path.join(outDir, "assets");
      fs.mkdirSync(assetsDir, { recursive: true });

      for (const file of [
        "racommons-llamacpp.wasm",
        "racommons-llamacpp.js",
        "racommons-llamacpp-webgpu.wasm",
        "racommons-llamacpp-webgpu.js"
      ]) {
        const source = path.join(llamacppWasm, file);
        if (fs.existsSync(source)) {
          fs.copyFileSync(source, path.join(assetsDir, file));
        }
      }

      const sherpaDir = path.join(onnxWasm, "sherpa");
      const sherpaOut = path.join(assetsDir, "sherpa");

      if (fs.existsSync(sherpaDir)) {
        fs.mkdirSync(sherpaOut, { recursive: true });
        for (const file of fs.readdirSync(sherpaDir)) {
          fs.copyFileSync(path.join(sherpaDir, file), path.join(sherpaOut, file));
        }
      }
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dir, "");

  return {
    plugins: [react(), groqDevProxyPlugin(env), copyWasmPlugin()],
    server: {
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Embedder-Policy": "credentialless"
      }
    },
    assetsInclude: ["**/*.wasm"],
    worker: { format: "es" },
    optimizeDeps: {
      exclude: ["@runanywhere/web-llamacpp", "@runanywhere/web-onnx"]
    }
  };
});
