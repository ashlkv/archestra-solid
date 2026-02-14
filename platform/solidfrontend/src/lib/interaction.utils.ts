import type { SupportedProvider } from "@shared";
import type { Interaction } from "@/types";
import AnthropicMessagesInteraction from "./llm-providers/anthropic";
import BedrockConverseInteraction from "./llm-providers/bedrock";
import CerebrasChatCompletionInteraction from "./llm-providers/cerebras";
import CohereChatInteraction from "./llm-providers/cohere";
import type { DualLlmResult, InteractionUtils, PartialUIMessage } from "./llm-providers/common";
import GeminiGenerateContentInteraction from "./llm-providers/gemini";
import MistralChatCompletionInteraction from "./llm-providers/mistral";
import OllamaChatCompletionInteraction from "./llm-providers/ollama";
import OpenAiChatCompletionInteraction from "./llm-providers/openai";
import VllmChatCompletionInteraction from "./llm-providers/vllm";
import ZhipuaiChatCompletionInteraction from "./llm-providers/zhipuai";

export const DEFAULT_TABLE_LIMIT = 10;
export const DEFAULT_SORT_BY = "createdAt" as const;
export const DEFAULT_SORT_DIRECTION = "desc" as const;

export function formatDate(date: string, dateFormat?: string): string {
    const d = new Date(date);
    if (dateFormat) {
        // Simple format for common patterns
        return d.toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
    }
    return d.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
}

export function formatCost(value: number): string {
    if (value < 0.000001) return `$${value.toExponential(2)}`;
    if (value < 0.01) return `$${value.toFixed(6)}`;
    return `$${value.toFixed(4)}`;
}

export function formatDuration(startDate: string, endDate: string): string {
    const durationMs = new Date(endDate).getTime() - new Date(startDate).getTime();
    if (durationMs < 1000) return `${durationMs}ms`;
    if (durationMs < 60_000) return `${(durationMs / 1000).toFixed(1)}s`;
    if (durationMs < 3_600_000)
        return `${Math.floor(durationMs / 60_000)}m ${Math.floor((durationMs % 60_000) / 1000)}s`;
    if (durationMs < 86_400_000)
        return `${Math.floor(durationMs / 3_600_000)}h ${Math.floor((durationMs % 3_600_000) / 60_000)}m`;
    return `${Math.floor(durationMs / 86_400_000)}d ${Math.floor((durationMs % 86_400_000) / 3_600_000)}h`;
}

export interface CostSavingsInput {
    cost: string | null | undefined;
    baselineCost: string | null | undefined;
    toonCostSavings: string | null | undefined;
    toonTokensBefore: number | null | undefined;
    toonTokensAfter: number | null | undefined;
}

export interface CostSavingsResult {
    costOptimizationSavings: number;
    toonSavings: number;
    toonTokensSaved: number | null;
    totalSavings: number;
    baselineCost: number;
    actualCost: number;
    savingsPercent: number;
    hasSavings: boolean;
}

export function calculateCostSavings(input: CostSavingsInput): CostSavingsResult {
    const costNum = input.cost ? Number.parseFloat(input.cost) : 0;
    const baselineCostNum = input.baselineCost ? Number.parseFloat(input.baselineCost) : 0;
    const toonCostSavingsNum = input.toonCostSavings ? Number.parseFloat(input.toonCostSavings) : 0;
    const toonTokensSaved =
        input.toonTokensBefore && input.toonTokensAfter && input.toonTokensBefore > input.toonTokensAfter
            ? input.toonTokensBefore - input.toonTokensAfter
            : null;
    const costOptimizationSavings = baselineCostNum - costNum;
    const totalSavings = costOptimizationSavings + toonCostSavingsNum;
    const savingsPercent = baselineCostNum > 0 ? (totalSavings / baselineCostNum) * 100 : 0;
    return {
        costOptimizationSavings,
        toonSavings: toonCostSavingsNum,
        toonTokensSaved,
        totalSavings,
        baselineCost: baselineCostNum,
        actualCost: baselineCostNum - totalSavings,
        savingsPercent,
        hasSavings: totalSavings !== 0,
    };
}

export class DynamicInteraction implements InteractionUtils {
    private interactionClass: InteractionUtils;
    private interaction: Interaction;

    id: string;
    profileId: string;
    externalAgentId: string | null;
    type: Interaction["type"];
    provider: SupportedProvider;
    endpoint: string;
    createdAt: string;
    modelName: string;

    constructor(interaction: Interaction) {
        const [provider, endpoint] = interaction.type.split(":");
        this.interaction = interaction;
        this.id = interaction.id;
        this.profileId = interaction.profileId;
        this.externalAgentId = interaction.externalAgentId;
        this.type = interaction.type;
        this.provider = provider as SupportedProvider;
        this.endpoint = endpoint;
        this.createdAt = interaction.createdAt;
        this.interactionClass = this.getInteractionClass(interaction);
        this.modelName = this.interactionClass.modelName;
    }

    private getInteractionClass(interaction: Interaction): InteractionUtils {
        const type = this.type;
        if (type === "openai:chatCompletions") return new OpenAiChatCompletionInteraction(interaction);
        if (type === "anthropic:messages") return new AnthropicMessagesInteraction(interaction);
        if (type === "bedrock:converse") return new BedrockConverseInteraction(interaction);
        if (type === "zhipuai:chatCompletions") return new ZhipuaiChatCompletionInteraction(interaction);
        if (type === "cerebras:chatCompletions") return new CerebrasChatCompletionInteraction(interaction);
        if (type === "mistral:chatCompletions") return new MistralChatCompletionInteraction(interaction);
        if (type === "vllm:chatCompletions") return new VllmChatCompletionInteraction(interaction);
        if (type === "ollama:chatCompletions") return new OllamaChatCompletionInteraction(interaction);
        if (type === "cohere:chat") return new CohereChatInteraction(interaction);
        if (type === "gemini:generateContent") return new GeminiGenerateContentInteraction(interaction);
        throw new Error(`Unsupported interaction type: ${type}`);
    }

    isLastMessageToolCall(): boolean {
        return this.interactionClass.isLastMessageToolCall();
    }
    getLastToolCallId(): string | null {
        return this.interactionClass.getLastToolCallId();
    }
    getToolNamesRefused(): string[] {
        return this.interactionClass.getToolNamesRefused();
    }
    getToolNamesRequested(): string[] {
        return this.interactionClass.getToolNamesRequested();
    }
    getToolNamesUsed(): string[] {
        return this.interactionClass.getToolNamesUsed();
    }
    getToolRefusedCount(): number {
        return this.interactionClass.getToolRefusedCount();
    }
    getLastUserMessage(): string {
        return this.interactionClass.getLastUserMessage();
    }
    getLastAssistantResponse(): string {
        return this.interactionClass.getLastAssistantResponse();
    }
    mapToUiMessages(dualLlmResults?: DualLlmResult[]): PartialUIMessage[] {
        return this.interactionClass.mapToUiMessages(dualLlmResults);
    }

    getToonSavings(): {
        originalSize: number;
        compressedSize: number;
        savedCharacters: number;
        percentageSaved: number;
    } | null {
        const toonTokensBefore = this.interaction.toonTokensBefore;
        const toonTokensAfter = this.interaction.toonTokensAfter;
        if (
            toonTokensBefore === null ||
            toonTokensAfter === null ||
            toonTokensBefore === undefined ||
            toonTokensAfter === undefined
        )
            return null;
        if (toonTokensAfter >= toonTokensBefore || toonTokensBefore === 0) return null;
        const savedCharacters = toonTokensBefore - toonTokensAfter;
        const percentageSaved = (savedCharacters / toonTokensBefore) * 100;
        return { originalSize: toonTokensBefore, compressedSize: toonTokensAfter, savedCharacters, percentageSaved };
    }
}
