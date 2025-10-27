/**
 * Custom observability metrics form LLMs: request metrics and token usage.
 */

import AnthropicProvider, {
  type ClientOptions as AnthropicClientOptions,
} from "@anthropic-ai/sdk";
import { GoogleGenAI, type GoogleGenAIOptions } from "@google/genai";
import OpenAIProvider, {
  type ClientOptions as OpenAIClientOptions,
} from "openai";
import client, { type LabelValues } from "prom-client";

type Fetch = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

// LLM-specific metrics matching fastify-metrics format for consistency.
// You can monitor request count, duration and error rate with these.
const llmRequestDuration = new client.Histogram({
  name: "llm_request_duration_seconds",
  help: "LLM request duration in seconds",
  labelNames: ["provider", "model", "status_code"],
  // Same bucket style as http_request_duration_seconds but adjusted for LLM latency
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60],
});

const llmTokensCounter = new client.Counter({
  name: "llm_tokens_total",
  help: "Total tokens used",
  labelNames: ["provider", "model", "agent", "type"], // type: input|output
});

// Separate counter for network / DNS errors so that status code 0 does not skew request metrics
const llmNetworkErrorCounter = new client.Counter({
  name: "llm_network_errors_total",
  help: "Total LLM network errors (failed before HTTP response)",
  labelNames: ["provider", "model"],
});

function getObservableFetch(
  provider: "openai" | "anthropic",
  agentId?: string,
): Fetch {
  return async function observableFetch(
    url: string | URL | Request,
    init?: RequestInit,
  ): Promise<Response> {
    const startTime = Date.now();
    let model = "unknown";
    let response: Response;

    // Extract model from request body (OpenAI/Anthropic send model in body)
    try {
      if (init?.body && typeof init.body === "string") {
        const requestBody = JSON.parse(init.body);
        model = requestBody.model || "unknown";
      }
    } catch (_parseError) {
      console.error("Error parsing LLM request JSON for model");
    }

    try {
      response = await fetch(url, init);

      const duration = (Date.now() - startTime) / 1000;
      const status = response.status.toString();
      llmRequestDuration.observe(
        { provider, model, status_code: status },
        duration,
      );
    } catch (error) {
      // Network errors only: fetch does not throw on 4xx or 5xx.
      llmNetworkErrorCounter.inc({ provider, model });
      throw error;
    }

    // Record token metrics
    if (
      response.ok &&
      // FIXME what about OpenAI streaming response?
      response.headers
        .get("content-type")
        ?.includes("application/json")
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

        const labels: LabelValues<"provider" | "model" | "agent" | "type"> = {
          provider,
          model,
        };
        if (agentId) {
          labels.agent = agentId;
        }
        if (inputTokens > 0) {
          llmTokensCounter.inc({ ...labels, type: "input" }, inputTokens);
        }
        if (outputTokens > 0) {
          llmTokensCounter.inc({ ...labels, type: "output" }, outputTokens);
        }
      } catch (_parseError) {
        console.error("Error parsing LLM response JSON for tokens");
      }
    }

    return response;
  };
}

// FIXME Don't instantiate providers. Just export fetch instead.
export function ObservableOpenAIProvider({
  agentId,
  ...options
}: OpenAIClientOptions & { agentId?: string }) {
  return new OpenAIProvider({
    ...options,
    fetch: getObservableFetch("openai", agentId),
  });
}

export function ObservableAnthropicProvider({
  agentId,
  ...options
}: AnthropicClientOptions & { agentId?: string }) {
  return new AnthropicProvider({
    ...options,
    fetch: getObservableFetch("anthropic", agentId),
  });
}

// FIXME Don't instantiate Gemini, wrap its instance instead.
export function ObservableGenAiProvider({
  agentId,
  ...options
}: GoogleGenAIOptions & { agentId?: string }) {
  const genAI = new GoogleGenAI(options);
  const originalGenerateContent = genAI.models.generateContent;
  genAI.models.generateContent = async (...args) => {
    const startTime = Date.now();
    const modelName = args[0]?.model || "unknown";

    try {
      const result = await originalGenerateContent.apply(genAI.models, args);
      const duration = Math.round((Date.now() - startTime) / 1000);

      // Assuming 200 status code. Gemini doesn't expose HTTP status, but unlike fetch, throws on 4xx & 5xx.
      llmRequestDuration.observe(
        { provider: "gemini", model: modelName, status_code: "200" },
        duration,
      );

      // Record token metrics
      if (result.usageMetadata) {
        const { promptTokenCount, candidatesTokenCount } = result.usageMetadata;
        const labels: LabelValues<"provider" | "model" | "agent" | "type"> = {
          provider: "gemini",
          model: modelName,
        };
        if (agentId) {
          labels.agent = agentId;
        }

        if (promptTokenCount && promptTokenCount > 0) {
          llmTokensCounter.inc({ ...labels, type: "input" }, promptTokenCount);
        }
        if (candidatesTokenCount && candidatesTokenCount > 0) {
          llmTokensCounter.inc(
            { ...labels, type: "output" },
            candidatesTokenCount,
          );
        }
      }

      return result;
    } catch (error) {
      const duration = Math.round((Date.now() - startTime) / 1000);

      if (
        error instanceof Error &&
        "status" in error &&
        typeof error.status === "number"
      ) {
        llmRequestDuration.observe(
          {
            provider: "gemini",
            model: modelName,
            status_code: String(error.status),
          },
          duration,
        );
      } else {
        // Network error (no HTTP response)
        llmNetworkErrorCounter.inc({ provider: "gemini", model: modelName });
      }

      throw error;
    }
  };
  return genAI;
}
