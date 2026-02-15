import { For, type JSX, Show } from "solid-js";
import { ShieldCheck, TriangleAlert } from "@/components/icons";
import { Markdown } from "@/components/primitives/Markdown";
import type { BlockedToolPart, DualLlmPart, PartialUIMessage } from "@/lib/llm-providers/common";
import { parsePolicyDenied } from "@/lib/llm-providers/common";
import styles from "./ChatViewer.module.css";
import { ToolCall } from "./ToolCall";

export function ChatViewer(props: { messages: PartialUIMessage[] }): JSX.Element {
    return (
        <div class={styles.container} data-label="ChatViewer">
            <For each={props.messages}>{(message) => <ChatMessage message={message} />}</For>
        </div>
    );
}

function ChatMessage(props: { message: PartialUIMessage }): JSX.Element {
    const roleLabel = () => {
        if (props.message.role === "user") return "User";
        if (props.message.role === "assistant") return "Assistant";
        return "System";
    };

    return (
        <div class={`${styles.message} ${styles[props.message.role]}`} data-label={`Message: ${props.message.role}`}>
            <span class={styles["message-role"]}>{roleLabel()}</span>
            <For each={props.message.parts}>{(part) => <MessagePart part={part} />}</For>
        </div>
    );
}

function MessagePart(props: { part: PartialUIMessage["parts"][number] }): JSX.Element {
    const part = () => props.part;

    return (
        <>
            <Show when={part().type === "text" && "text" in part()}>
                <TextBubble text={(part() as { type: "text"; text: string }).text} />
            </Show>

            <Show when={(part().type === "dynamic-tool" || part().type === "tool-invocation") && "toolName" in part()}>
                <div class={styles["tool-parts"]}>
                    <ToolCallPart part={part() as any} />
                </div>
            </Show>

            <Show when={part().type === "dual-llm-analysis"}>
                <DualLlmPartView part={part() as DualLlmPart} />
            </Show>

            <Show when={part().type === "blocked-tool"}>
                <BlockedToolPartView part={part() as BlockedToolPart} />
            </Show>

            <Show when={part().type === "reasoning" && "text" in part()}>
                <div class={styles.reasoning}>
                    <div class={styles["reasoning-label"]}>Thinking</div>
                    {(part() as { text: string }).text}
                </div>
            </Show>
        </>
    );
}

function TextBubble(props: { text: string }): JSX.Element {
    const policyDenied = () => parsePolicyDenied(props.text);

    return (
        <>
            <Show when={policyDenied()}>
                <div
                    style={{
                        background: "color-mix(in srgb, var(--destructive) 10%, transparent)",
                        border: "1px solid var(--destructive)",
                        "border-radius": "12px",
                        padding: "0.75rem 1rem",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            "align-items": "center",
                            gap: "0.5rem",
                            "font-weight": "bold",
                            color: "var(--destructive)",
                        }}
                    >
                        <TriangleAlert style={{ width: "16px", height: "16px" }} />
                        Tool invocation denied by policy
                    </div>
                    <div style={{ "font-size": "var(--font-size-small)", "margin-top": "0.5rem" }}>{props.text}</div>
                </div>
            </Show>
            <Show when={!policyDenied()}>
                <div class={styles.bubble}>
                    <Markdown>{props.text}</Markdown>
                </div>
            </Show>
        </>
    );
}

function ToolCallPart(props: {
    part: {
        toolName: string;
        toolCallId: string;
        state: string;
        input?: unknown;
        output?: unknown;
        errorText?: string;
    };
}): JSX.Element {
    return (
        <ToolCall
            toolName={props.part.toolName}
            state={props.part.state as "input-available" | "output-available"}
            input={props.part.input}
            output={props.part.output}
            errorText={props.part.errorText}
        />
    );
}

function DualLlmPartView(props: { part: DualLlmPart }): JSX.Element {
    return (
        <div
            style={{
                border: "1px solid var(--info)",
                "border-radius": "12px",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    display: "flex",
                    "align-items": "center",
                    gap: "0.5rem",
                    padding: "0.5rem 0.75rem",
                    background: "color-mix(in srgb, var(--info) 10%, transparent)",
                    "border-bottom": "1px solid var(--info)",
                }}
            >
                <ShieldCheck style={{ width: "16px", height: "16px", color: "var(--info)" }} />
                <span style={{ "font-weight": "bold", "font-size": "var(--font-size-small)" }}>Dual LLM analysis</span>
            </div>
            <div style={{ padding: "0.75rem" }}>
                <div
                    style={{
                        "font-size": "var(--font-size-xsmall)",
                        color: "var(--muted-foreground)",
                        "margin-bottom": "0.25rem",
                    }}
                >
                    Safe result
                </div>
                <div style={{ "font-size": "var(--font-size-small)", "margin-bottom": "1rem" }}>
                    <Markdown>{props.part.safeResult}</Markdown>
                </div>
                <Show when={props.part.conversations.length > 1}>
                    <div
                        style={{
                            "font-size": "var(--font-size-xsmall)",
                            color: "var(--muted-foreground)",
                            "margin-bottom": "0.25rem",
                        }}
                    >
                        Questions and answers
                    </div>
                    <For each={props.part.conversations.slice(1)}>
                        {(conv) => (
                            <div
                                style={{
                                    padding: "0.5rem",
                                    background: conv.role === "user" ? "var(--background)" : "transparent",
                                    "border-radius": "var(--radius)",
                                    "margin-bottom": "0.25rem",
                                    "font-size": "var(--font-size-small)",
                                }}
                            >
                                <span style={{ "font-weight": "bold" }}>{conv.role === "user" ? "Q: " : "A: "}</span>
                                {typeof conv.content === "string" ? conv.content : JSON.stringify(conv.content)}
                            </div>
                        )}
                    </For>
                </Show>
            </div>
        </div>
    );
}

function BlockedToolPartView(props: { part: BlockedToolPart }): JSX.Element {
    return (
        <div
            style={{
                background: "color-mix(in srgb, var(--destructive) 10%, transparent)",
                border: "1px solid var(--destructive)",
                "border-radius": "12px",
                padding: "0.75rem 1rem",
            }}
        >
            <div style={{ display: "flex", "align-items": "start", gap: "0.5rem" }}>
                <TriangleAlert
                    style={{
                        width: "16px",
                        height: "16px",
                        color: "var(--destructive)",
                        "flex-shrink": "0",
                        "margin-top": "2px",
                    }}
                />
                <div>
                    <div style={{ "font-weight": "bold", color: "var(--destructive)" }}>{props.part.reason}</div>
                    <div style={{ "font-size": "var(--font-size-xsmall)", "margin-top": "0.5rem" }}>
                        <span style={{ "font-weight": "bold" }}>Tool: </span>
                        <code
                            style={{
                                "font-family": "var(--font-mono)",
                                background: "var(--muted-background)",
                                padding: "0.125rem 0.375rem",
                                "border-radius": "var(--radius)",
                            }}
                        >
                            {props.part.toolName}
                        </code>
                    </div>
                    <Show when={props.part.toolArguments}>
                        <div style={{ "font-size": "var(--font-size-xsmall)", "margin-top": "0.25rem" }}>
                            <span style={{ "font-weight": "bold" }}>Arguments: </span>
                            <code style={{ "font-family": "var(--font-mono)", "word-break": "break-all" }}>
                                {props.part.toolArguments}
                            </code>
                        </div>
                    </Show>
                </div>
            </div>
        </div>
    );
}
