/**
 * Custom observability metrics form LLMs: request metrics and token usage.
 * To instrument OpenAI or Anthropic clients, pass observable fetch to the fetch option.
 * To instrument Gemini, provide its instance to a getObservableGenAI, which will wrap around its model calls.
 */

import type { GoogleGenAI } from "@google/genai";
import client from "prom-client";

type Fetch = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

// LLM-specific metrics matching fastify-metrics format for consistency.
// You can monitor request count, duration and error rate with these.
const llmRequestDuration = new client.Histogram({
  name: "llm_request_duration_seconds",
  help: "LLM request duration in seconds",
  labelNames: ["provider", "agent", "status_code"],
  // Same bucket style as http_request_duration_seconds but adjusted for LLM latency
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60],
});

const llmTokensCounter = new client.Counter({
  name: "llm_tokens_total",
  help: "Total tokens used",
  labelNames: ["provider", "agent", "type"], // type: input|output
});

/**
 * Returns a fetch wrapped in observability. Use it as OpenAI or Anthropic provider custom fetch implementation.
 */
export function getObservableFetch(
  provider: "openai" | "anthropic",
  agent: string = "unknown",
): Fetch {
  return async function observableFetch(
    url: string | URL | Request,
    init?: RequestInit,
  ): Promise<Response> {
    const startTime = Date.now();
    let response: Response;

    try {
      response = await fetch(url, init);
      const duration = Math.round((Date.now() - startTime) / 1000);
      const status = response.status.toString();
      llmRequestDuration.observe(
        { provider, agent, status_code: status },
        duration,
      );
    } catch (error) {
      // Network errors only: fetch does not throw on 4xx or 5xx.
      const duration = Math.round((Date.now() - startTime) / 1000);
      llmRequestDuration.observe(
        { provider, agent, status_code: "0" },
        duration,
      );
      throw error;
    }

    // Record token metrics
    if (
      response.ok &&
      response.headers.get("content-type")?.includes("application/json")
    ) {
      const cloned = response.clone();
      try {
        const data = await cloned.json();

        // OpenAI: prompt_tokens, completion_tokens
        // Anthropic: input_tokens, output_tokens
        let inputTokens = 0;
        let outputTokens = 0;
        if (provider === "openai") {
          inputTokens = data.usage?.prompt_tokens;
          outputTokens = data.usage?.completion_tokens;
        } else if (provider === "anthropic") {
          inputTokens = data.usage?.input_tokens;
          outputTokens = data.usage?.output_tokens;
        } else {
          throw new Error("Unknown provider when logging usage token metrics");
        }

        if (inputTokens > 0) {
          llmTokensCounter.inc({ provider, agent, type: "input" }, inputTokens);
        }
        if (outputTokens > 0) {
          llmTokensCounter.inc(
            { provider, agent, type: "output" },
            outputTokens,
          );
        }
      } catch (_parseError) {
        console.error("Error parsing LLM response JSON for tokens");
      }
    }

    return response;
  };
}

/**
 * Wraps observability around GenAI's LLM request methods
 */
export function getObservableGenAI(
  genAI: GoogleGenAI,
  agent: string = "unknown",
) {
  const originalGenerateContent = genAI.models.generateContent;
  const provider = "gemini";
  genAI.models.generateContent = async (...args) => {
    const startTime = Date.now();

    try {
      const result = await originalGenerateContent.apply(genAI.models, args);
      const duration = Math.round((Date.now() - startTime) / 1000);

      // Assuming 200 status code. Gemini doesn't expose HTTP status, but unlike fetch, throws on 4xx & 5xx.
      llmRequestDuration.observe(
        { provider, agent, status_code: "200" },
        duration,
      );

      // Record token metrics
      const { promptTokenCount = 0, candidatesTokenCount = 0 } =
        result.usageMetadata || {};
      if (promptTokenCount > 0) {
        llmTokensCounter.inc(
          { provider, agent, type: "input" },
          promptTokenCount,
        );
      }
      if (candidatesTokenCount > 0) {
        llmTokensCounter.inc(
          { provider, agent, type: "output" },
          candidatesTokenCount,
        );
      }

      return result;
    } catch (error) {
      const duration = Math.round((Date.now() - startTime) / 1000);
      const statusCode =
        error instanceof Error &&
        "status" in error &&
        typeof error.status === "number"
          ? error.status.toString()
          : "0";

      llmRequestDuration.observe(
        { provider, agent, status_code: statusCode },
        duration,
      );

      throw error;
    }
  };
  return genAI;
}
