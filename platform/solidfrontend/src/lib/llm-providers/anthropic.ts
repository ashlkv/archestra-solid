import type { archestraApiTypes } from "@shared";
import type { DualLlmResult, Interaction, InteractionUtils, PartialUIMessage } from "./common";

class AnthropicMessagesInteraction implements InteractionUtils {
    private request: archestraApiTypes.AnthropicMessagesRequest;
    private response: archestraApiTypes.AnthropicMessagesResponse;
    modelName: string;

    constructor(interaction: Interaction) {
        this.request = interaction.request as archestraApiTypes.AnthropicMessagesRequest;
        this.response = interaction.response as archestraApiTypes.AnthropicMessagesResponse;
        this.modelName = interaction.model ?? this.request.model;
    }

    isLastMessageToolCall(): boolean {
        const messages = this.request.messages;
        if (messages.length === 0) {
            return false;
        }
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role === "user" && Array.isArray(lastMessage.content)) {
            return lastMessage.content.some((block) => block.type === "tool_result");
        }
        return false;
    }

    getLastToolCallId(): string | null {
        const messages = this.request.messages;
        if (messages.length === 0) {
            return null;
        }
        for (let i = messages.length - 1; i >= 0; i--) {
            const message = messages[i];
            if (message.role === "user" && Array.isArray(message.content)) {
                for (const block of message.content) {
                    if (block.type === "tool_result" && "tool_use_id" in block) {
                        return block.tool_use_id;
                    }
                }
            }
        }
        return null;
    }

    getToolNamesUsed(): string[] {
        const toolsUsed = new Set<string>();
        for (const message of this.request.messages) {
            if (message.role === "assistant" && Array.isArray(message.content)) {
                for (const block of message.content) {
                    if (block.type === "tool_use" && "name" in block) {
                        toolsUsed.add(block.name);
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
        if (Array.isArray(this.response.content)) {
            for (const block of this.response.content) {
                if (block.type === "tool_use" && "name" in block) {
                    toolsRequested.add(block.name);
                }
            }
        }
        return Array.from(toolsRequested);
    }

    getToolRefusedCount(): number {
        return 0;
    }

    getLastUserMessage(): string {
        const reversedMessages = [...this.request.messages].reverse();
        for (const message of reversedMessages) {
            if (message.role !== "user") {
                continue;
            }
            if (typeof message.content === "string") {
                return message.content;
            }
            if (Array.isArray(message.content)) {
                for (const block of message.content) {
                    if (block.type === "text" && "text" in block) {
                        return block.text;
                    }
                }
            }
        }
        return "";
    }

    getLastAssistantResponse(): string {
        const responseContent = this.response.content;
        if (!Array.isArray(responseContent)) {
            return "";
        }
        for (const block of responseContent) {
            if (block.type === "text" && "text" in block) {
                return block.text;
            }
        }
        return "";
    }

    private mapToUiMessage(
        message:
            | archestraApiTypes.AnthropicMessagesRequest["messages"][number]
            | {
                  role: "assistant";
                  content: archestraApiTypes.AnthropicMessagesResponse["content"];
              },
        _dualLlmResults?: DualLlmResult[],
    ): PartialUIMessage {
        const parts: PartialUIMessage["parts"] = [];
        const { content, role } = message;

        if (!Array.isArray(content)) {
            if (typeof content === "string") {
                parts.push({ type: "text", text: content });
            }
            return { role: role as PartialUIMessage["role"], parts };
        }

        for (const block of content) {
            if (block.type === "text" && "text" in block) {
                parts.push({ type: "text", text: block.text });
            } else if (block.type === "tool_use" && "name" in block && "id" in block) {
                parts.push({
                    type: "dynamic-tool",
                    toolName: block.name,
                    toolCallId: block.id,
                    state: "input-available",
                    input: block.input,
                });
            }
        }

        return {
            role: role as PartialUIMessage["role"],
            parts,
        };
    }

    mapToUiMessages(dualLlmResults?: DualLlmResult[]): PartialUIMessage[] {
        const uiMessages: PartialUIMessage[] = [];
        const messages = this.request.messages;

        const userMessagesWithToolResults = new Set<number>();

        for (let i = 0; i < messages.length; i++) {
            const msg = messages[i];
            if (msg.role === "user" && Array.isArray(msg.content)) {
                const hasOnlyToolResults = msg.content.every((block) => block.type === "tool_result");
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
                const hasToolUse = msg.content.some((block) => block.type === "tool_use");

                if (hasToolUse) {
                    const toolCallParts: PartialUIMessage["parts"] = [...uiMessage.parts];

                    for (const block of msg.content) {
                        if (block.type === "tool_use" && "id" in block) {
                            const toolResultMsg = messages
                                .slice(i + 1)
                                .find(
                                    (m) =>
                                        m.role === "user" &&
                                        Array.isArray(m.content) &&
                                        m.content.some(
                                            (b) =>
                                                b.type === "tool_result" &&
                                                "tool_use_id" in b &&
                                                b.tool_use_id === block.id,
                                        ),
                                );

                            if (toolResultMsg && Array.isArray(toolResultMsg.content)) {
                                const toolResultBlock = toolResultMsg.content.find(
                                    (b) => b.type === "tool_result" && "tool_use_id" in b && b.tool_use_id === block.id,
                                );

                                if (toolResultBlock && toolResultBlock.type === "tool_result") {
                                    let output: unknown;
                                    try {
                                        output =
                                            typeof toolResultBlock.content === "string"
                                                ? JSON.parse(toolResultBlock.content)
                                                : toolResultBlock.content;
                                    } catch {
                                        output = toolResultBlock.content;
                                    }

                                    toolCallParts.push({
                                        type: "dynamic-tool",
                                        toolName: "tool-result",
                                        toolCallId: block.id,
                                        state: "output-available",
                                        input: {},
                                        output,
                                    });

                                    const dualLlmResultForTool = dualLlmResults?.find(
                                        (result) => result.toolCallId === block.id,
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

                    uiMessages.push({
                        ...uiMessage,
                        parts: toolCallParts,
                    });
                } else {
                    uiMessages.push(uiMessage);
                }
            } else {
                uiMessages.push(uiMessage);
            }
        }

        uiMessages.push(this.mapToUiMessage({ role: "assistant", content: this.response.content }, dualLlmResults));

        return uiMessages;
    }
}

export default AnthropicMessagesInteraction;
