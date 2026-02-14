import type { archestraApiTypes } from "@shared";

export type Interaction = archestraApiTypes.GetInteractionsResponses["200"]["data"][number];
export type DualLlmResult = archestraApiTypes.GetDualLlmResultsByInteractionResponses["200"][number];

export interface RefusalInfo {
    toolName?: string;
    toolArguments?: string;
    reason?: string;
}

export type BlockedToolPart = {
    type: "blocked-tool";
    toolName: string;
    toolArguments?: string;
    reason: string;
    fullRefusal?: string;
};

export type PolicyDeniedPart = {
    type: string;
    toolCallId: string;
    state: "output-denied";
    input: Record<string, unknown>;
    errorText: string;
};

export type DualLlmPart = {
    type: "dual-llm-analysis";
    toolCallId: string;
    safeResult: string;
    conversations: Array<{
        role: "user" | "assistant";
        content: string | unknown;
    }>;
};

export type PartialUIMessage = {
    id?: string;
    role: "system" | "user" | "assistant";
    parts: Array<
        | { type: "text"; text: string }
        | {
              type: "dynamic-tool" | "tool-invocation";
              toolName: string;
              toolCallId: string;
              state: "input-available" | "output-available";
              input: unknown;
              output?: unknown;
              errorText?: string;
          }
        | { type: "reasoning"; text: string }
        | { type: "source-url"; url: string }
        | { type: "file"; mediaType: string; url: string }
        | BlockedToolPart
        | DualLlmPart
        | PolicyDeniedPart
    >;
    metadata?: {
        trusted?: boolean;
        blocked?: boolean;
        reason?: string;
    };
};

export interface InteractionUtils {
    modelName: string;
    isLastMessageToolCall(): boolean;
    getLastToolCallId(): string | null;
    getToolNamesUsed(): string[];
    getToolNamesRefused(): string[];
    getToolNamesRequested(): string[];
    getToolRefusedCount(): number;
    getLastUserMessage(): string;
    getLastAssistantResponse(): string;
    mapToUiMessages(dualLlmResults?: DualLlmResult[]): PartialUIMessage[];
}

export function parseRefusalMessage(refusal: string): RefusalInfo {
    const toolNameMatch = refusal.match(/<archestra-tool-name>(.*?)<\/archestra-tool-name>/);
    const toolArgsMatch = refusal.match(/<archestra-tool-arguments>(.*?)<\/archestra-tool-arguments>/);
    const toolReasonMatch = refusal.match(/<archestra-tool-reason>(.*?)<\/archestra-tool-reason>/);

    return {
        toolName: toolNameMatch?.[1],
        toolArguments: toolArgsMatch?.[1],
        reason: toolReasonMatch?.[1] || "Blocked by policy",
    };
}

export function parsePolicyDenied(text: string): PolicyDeniedPart | null {
    let actualText = text;
    try {
        const parsed = JSON.parse(text);
        if (parsed.originalError?.message) {
            actualText = parsed.originalError.message;
        } else if (parsed.message) {
            actualText = parsed.message;
        }
    } catch {
        // Not JSON, use as-is
    }

    const lowerText = actualText.toLowerCase();
    const hasKeywords =
        lowerText.includes("denied") &&
        lowerText.includes("tool") &&
        lowerText.includes("invocation") &&
        lowerText.includes("policy");

    if (!hasKeywords) {
        return null;
    }

    const match = actualText.match(
        /invoke[d]?\s+(?:the\s+)?(.+?)\s+tool[\s\S]*?(\{[\s\S]*?\})[\s\S]*?(?:denied|blocked)[\s\S]*?:\s*([\s\S]+)/i,
    );
    if (match) {
        const [, toolName, argsStr, reason] = match;
        let input: Record<string, unknown> = {};
        try {
            input = JSON.parse(argsStr);
        } catch {
            // Keep empty if parsing fails
        }
        return {
            type: `tool-${toolName}`,
            toolCallId: "",
            state: "output-denied",
            input,
            errorText: JSON.stringify({ reason: reason.trim() }),
        };
    }

    return null;
}
