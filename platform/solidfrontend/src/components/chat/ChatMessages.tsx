import type { ChatStatus, UIMessage } from "ai";
import { For, type JSX, Show } from "solid-js";
import { Loader2, MessageCircle } from "@/components/icons";
import { Markdown } from "@/components/primitives/Markdown";
import styles from "./ChatMessages.module.css";
import { type AnyToolPart, MessageTool } from "./MessageTool";

function isToolPart(part: { type: string }): boolean {
    return part.type.startsWith("tool-") || part.type === "dynamic-tool";
}

export function ChatMessages(props: {
    messages: () => UIMessage[];
    status: () => ChatStatus;
    error: () => Error | undefined;
    agentName?: string;
}): JSX.Element {
    const isActive = () => props.status() === "streaming" || props.status() === "submitted";
    const isEmpty = () => props.messages().length === 0;

    let containerRef: HTMLDivElement | undefined;

    const scrollToBottom = () => {
        if (containerRef) {
            containerRef.scrollTop = containerRef.scrollHeight;
        }
    };

    // Auto-scroll when messages change
    const messagesForScroll = () => {
        const messages = props.messages();
        // Read length to create dependency
        if (messages.length > 0) {
            // Defer to next tick so DOM has updated
            queueMicrotask(scrollToBottom);
        }
        return messages;
    };

    return (
        <div class={styles.container} ref={containerRef} data-label="Chat messages">
            <Show when={isEmpty() && !isActive()}>
                <div class={styles["empty-state"]}>
                    <MessageCircle size={32} />
                    <Show when={props.agentName}>
                        <span class={styles["empty-state-title"]}>Chat with {props.agentName}</span>
                    </Show>
                    <span>Send a message to start the conversation</span>
                </div>
            </Show>

            <For each={messagesForScroll()}>
                {(message) => (
                    <div class={`${styles.message} ${styles[message.role]}`} data-label={`Message: ${message.role}`}>
                        <span class={styles["message-role"]}>{message.role}</span>
                        <For each={message.parts}>
                            {(part) => (
                                <>
                                    <Show when={part.type === "text" && "text" in part}>
                                        <Show when={message.role === "user"}>
                                            <div class={styles["message-content"]}>
                                                {(part as { text: string }).text}
                                            </div>
                                        </Show>
                                        <Show when={message.role === "assistant"}>
                                            <div class={styles["message-content"]}>
                                                <Markdown>{(part as { text: string }).text}</Markdown>
                                            </div>
                                        </Show>
                                    </Show>
                                    <Show when={isToolPart(part)}>
                                        <div class={styles["tool-parts"]}>
                                            <MessageTool part={part as AnyToolPart} />
                                        </div>
                                    </Show>
                                </>
                            )}
                        </For>
                    </div>
                )}
            </For>

            <Show when={isActive()}>
                <div class={styles.loading}>
                    <Loader2 size={16} />
                    <span>{props.status() === "submitted" ? "Thinking..." : "Generating..."}</span>
                </div>
            </Show>

            <Show when={props.error()}>
                <div class={styles.error}>{props.error()?.message ?? "An error occurred"}</div>
            </Show>
        </div>
    );
}
