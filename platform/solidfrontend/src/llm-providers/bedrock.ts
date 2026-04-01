import type { DualLlmResult, Interaction, InteractionUtils, PartialUIMessage } from "./common";

interface BedrockContentBlock {
    text?: string;
    toolUse?: { toolUseId: string; name: string; input: unknown };
    toolResult?: { toolUseId: string; content: unknown; status?: string };
    guardContent?: unknown;
    document?: unknown;
    image?: unknown;
    video?: unknown;
}

interface BedrockMessage {
    role: "user" | "assistant";
    content: BedrockContentBlock[];
}

interface BedrockResponseContentBlock {
    text?: string;
    toolUse?: { toolUseId: string; name: string; input: unknown };
    reasoningContent?: unknown;
}

interface BedrockConverseRequest {
    modelId: string;
    messages?: BedrockMessage[];
    system?: unknown;
    inferenceConfig?: unknown;
    toolConfig?: unknown;
}

interface BedrockConverseResponse {
    output?: {
        message?: { role: "assistant"; content: BedrockResponseContentBlock[] };
    };
    stopReason?: string;
    usage?: { inputTokens: number; outputTokens: number };
}

class BedrockConverseInteraction implements InteractionUtils {
    private request: BedrockConverseRequest;
    private response: BedrockConverseResponse;
    modelName: string;

    constructor(interaction: Interaction) {
        this.request = interaction.request as BedrockConverseRequest;
        this.response = interaction.response as BedrockConverseResponse;
        this.modelName = interaction.model ?? this.request.modelId;
    }

    isLastMessageToolCall(): boolean {
        const messages = this.request.messages;
        if (!messages || messages.length === 0) {
            return false;
        }
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role === "user" && Array.isArray(lastMessage.content)) {
            return lastMessage.content.some((block) => block.toolResult != null);
        }
        return false;
    }

    getLastToolCallId(): string | null {
        const messages = this.request.messages;
        if (!messages || messages.length === 0) {
            return null;
        }
        for (let i = messages.length - 1; i >= 0; i--) {
            const message = messages[i];
            if (message.role === "user" && Array.isArray(message.content)) {
                for (const block of message.content) {
                    if (block.toolResult?.toolUseId) {
                        return block.toolResult.toolUseId;
                    }
                }
            }
        }
        return null;
    }

    getToolNamesUsed(): string[] {
        const toolsUsed = new Set<string>();
        const messages = this.request.messages;
        if (!messages) return [];
        for (const message of messages) {
            if (message.role === "assistant" && Array.isArray(message.content)) {
                for (const block of message.content) {
                    if (block.toolUse?.name) {
                        toolsUsed.add(block.toolUse.name);
                    }
                }
            }
        }
        return Array.from(toolsUsed);
    }

    getToolNamesRefused(): string[] {
        return [];
    }

    getToolNamesRequested(): string[] {
        const toolsRequested = new Set<string>();
        const responseContent = this.response.output?.message?.content;
        if (Array.isArray(responseContent)) {
            for (const block of responseContent) {
                if (block.toolUse?.name) {
                    toolsRequested.add(block.toolUse.name);
                }
            }
        }
        return Array.from(toolsRequested);
    }

    getToolRefusedCount(): number {
        return 0;
    }

    getLastUserMessage(): string {
        const messages = this.request.messages;
        if (!messages) return "";
        const reversedMessages = [...messages].reverse();
        for (const message of reversedMessages) {
            if (message.role !== "user") {
                continue;
            }
            if (Array.isArray(message.content)) {
                for (const block of message.content) {
                    if (block.text && !block.toolResult) {
                        return block.text;
                    }
                }
            }
        }
        return "";
    }

    getLastAssistantResponse(): string {
        const responseContent = this.response.output?.message?.content;
        if (!Array.isArray(responseContent)) {
            return "";
        }
        for (const block of responseContent) {
            if (block.text) {
                return block.text;
            }
        }
        return "";
    }

    private mapToUiMessage(
        message: BedrockMessage | { role: "assistant"; content: BedrockResponseContentBlock[] },
        _dualLlmResults?: DualLlmResult[],
    ): PartialUIMessage {
        const parts: PartialUIMessage["parts"] = [];
        const { content, role } = message;

        if (!Array.isArray(content)) {
            return { role: role as PartialUIMessage["role"], parts };
        }

        for (const block of content) {
            if (block.text) {
                parts.push({ type: "text", text: block.text });
            } else if (block.toolUse) {
                parts.push({
                    type: "dynamic-tool",
                    toolName: block.toolUse.name,
                    toolCallId: block.toolUse.toolUseId,
                    state: "input-available",
                    input: block.toolUse.input,
                });
            }
        }

        return { role: role as PartialUIMessage["role"], parts };
    }

    mapToUiMessages(dualLlmResults?: DualLlmResult[]): PartialUIMessage[] {
        const uiMessages: PartialUIMessage[] = [];
        const messages = this.request.messages;
        if (!messages) return uiMessages;

        const userMessagesWithToolResults = new Set<number>();
        for (let i = 0; i < messages.length; i++) {
            const msg = messages[i];
            if (msg.role === "user" && Array.isArray(msg.content)) {
                const hasOnlyToolResults = msg.content.every((block) => block.toolResult != null);
                if (hasOnlyToolResults && msg.content.length > 0) {
                    userMessagesWithToolResults.add(i);
                }
            }
        }

        for (let i = 0; i < messages.length; i++) {
            const msg = messages[i];
            if (userMessagesWithToolResults.has(i)) {
                continue;
            }
            const uiMessage = this.mapToUiMessage(msg, dualLlmResults);

            if (msg.role === "assistant" && Array.isArray(msg.content)) {
                const hasToolUse = msg.content.some((block) => block.toolUse != null);

                if (hasToolUse) {
                    const toolCallParts: PartialUIMessage["parts"] = [...uiMessage.parts];

                    for (const block of msg.content) {
                        if (block.toolUse) {
                            const toolResultMsg = messages
                                .slice(i + 1)
                                .find(
                                    (m) =>
                                        m.role === "user" &&
                                        Array.isArray(m.content) &&
                                        m.content.some((b) => b.toolResult?.toolUseId === block.toolUse?.toolUseId),
                                );

                            if (toolResultMsg && Array.isArray(toolResultMsg.content)) {
                                const toolResultBlock = toolResultMsg.content.find(
                                    (b) => b.toolResult?.toolUseId === block.toolUse?.toolUseId,
                                );

                                if (toolResultBlock?.toolResult) {
                                    let output: unknown;
                                    try {
                                        output =
                                            typeof toolResultBlock.toolResult.content === "string"
                                                ? JSON.parse(toolResultBlock.toolResult.content)
                                                : toolResultBlock.toolResult.content;
                                    } catch {
                                        output = toolResultBlock.toolResult.content;
                                    }

                                    toolCallParts.push({
                                        type: "dynamic-tool",
                                        toolName: "tool-result",
                                        toolCallId: block.toolUse.toolUseId,
                                        state: "output-available",
                                        input: {},
                                        output,
                                    });

                                    const dualLlmResultForTool = dualLlmResults?.find(
                                        (result) => result.toolCallId === block.toolUse?.toolUseId,
                                    );

                                    if (dualLlmResultForTool) {
                                        toolCallParts.push({
                                            type: "dual-llm-analysis",
                                            toolCallId: dualLlmResultForTool.toolCallId,
                                            safeResult: dualLlmResultForTool.result,
                                            conversations: Array.isArray(dualLlmResultForTool.conversations)
                                                ? (dualLlmResultForTool.conversations as Array<{
                                                      role: "user" | "assistant";
                                                      content: string | unknown;
                                                  }>)
                                                : [],
                                        });
                                    }
                                }
                            }
                        }
                    }

                    uiMessages.push({ ...uiMessage, parts: toolCallParts });
                } else {
                    uiMessages.push(uiMessage);
                }
            } else {
                uiMessages.push(uiMessage);
            }
        }

        const responseContent = this.response.output?.message?.content;
        if (responseContent) {
            uiMessages.push(this.mapToUiMessage({ role: "assistant", content: responseContent }, dualLlmResults));
        }

        return uiMessages;
    }
}

export default BedrockConverseInteraction;
