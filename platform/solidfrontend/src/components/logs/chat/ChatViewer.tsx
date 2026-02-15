import { createSignal, For, type JSX, Show } from "solid-js";
import { ShieldCheck, TriangleAlert, UnfoldVertical } from "@/components/icons";
import { Markdown } from "@/components/primitives/Markdown";
import { TextBubble } from "@/components/primitives/TextBubble";
import type { BlockedToolPart, DualLlmPart, PartialUIMessage } from "@/lib/llm-providers/common";
import { parsePolicyDenied } from "@/lib/llm-providers/common";
import styles from "./ChatViewer.module.css";
import { ToolCall, type ToolState } from "./ToolCall";
import { Button } from '~/components/primitives/Button';

export function ChatViewer(props: { messages: PartialUIMessage[]; timestamp?: string }): JSX.Element {
    const [expanded, setExpanded] = createSignal(false);

    const splitIndex = () => findLastExchangeStart(props.messages);
    const previousMessages = () => props.messages.slice(0, splitIndex());
    const visibleMessages = () => props.messages.slice(splitIndex());
    const hasPrevious = () => previousMessages().length > 0;

    return (
        <div class={styles.container} data-label="ChatViewer">
            <Show when={hasPrevious()}>
                <div class={expanded() ? styles["previous-expanded"] : styles["previous-collapsed"]}>
                    <For each={previousMessages()}>{(message) => <ChatMessage message={message} />}</For>
                </div>
                <Show when={!expanded()}>
                    <Button size="small" class={styles["previous-reveal"]} onClick={() => setExpanded(true)}>
                        <UnfoldVertical style={{ width: "14px", height: "14px" }} />
                        Show {previousMessages().length} previous messages
                    </Button>
                </Show>
            </Show>

            <For each={visibleMessages()}>
                {(message) => <ChatMessage message={message} timestamp={props.timestamp} />}
            </For>
        </div>
    );
}

function ChatMessage(props: { message: PartialUIMessage; timestamp?: string }): JSX.Element {
    const roleLabel = () => {
        if (props.message.role === "user") return "Client";
        if (props.message.role === "assistant") return "Server";
        return "System";
    };

    // Split parts into groups: consecutive non-tool parts form message bubbles,
    // tool parts render as separate centered elements between them.
    const groups = () => {
        const result: Array<{
            kind: "message" | "tool";
            parts: Array<{ part: PartialUIMessage["parts"][number]; index: number }>;
        }> = [];
        for (let i = 0; i < props.message.parts.length; i++) {
            const part = props.message.parts[i];
            const isTool = isToolPart(part);
            const last = result[result.length - 1];
            if (last && last.kind === (isTool ? "tool" : "message")) {
                last.parts.push({ part, index: i });
            } else {
                result.push({ kind: isTool ? "tool" : "message", parts: [{ part, index: i }] });
            }
        }
        return result;
    };

    return (
        <>
            <For each={groups()}>
                {(group, groupIndex) => (
                    <Show
                        when={group.kind === "message"}
                        fallback={
                            <div class={styles["tool-parts"]}>
                                <For each={group.parts}>
                                    {(item) => (
                                        <MessagePart
                                            part={item.part}
                                            index={item.index}
                                            parts={props.message.parts}
                                            role={props.message.role}
                                        />
                                    )}
                                </For>
                                <Show when={props.timestamp && groupIndex() === groups().length - 1}>
                                    <span class={styles.timestamp}>{formatTimestamp(props.timestamp!)}</span>
                                </Show>
                            </div>
                        }
                    >
                        <div
                            class={`${styles.message} ${styles[props.message.role]}`}
                            data-label={`Message: ${props.message.role}`}
                        >
                            <Show when={groupIndex() === 0}>
                                <span class={styles["message-role"]}>{roleLabel()}</span>
                            </Show>
                            <For each={group.parts}>
                                {(item) => (
                                    <MessagePart
                                        part={item.part}
                                        index={item.index}
                                        parts={props.message.parts}
                                        role={props.message.role}
                                    />
                                )}
                            </For>
                            <Show when={props.timestamp && groupIndex() === groups().length - 1}>
                                <span class={styles.timestamp}>{formatTimestamp(props.timestamp!)}</span>
                            </Show>
                        </div>
                    </Show>
                )}
            </For>
        </>
    );
}

type ToolPart = {
    type: "dynamic-tool" | "tool-invocation";
    toolName: string;
    toolCallId: string;
    state: "input-available" | "output-available";
    input: unknown;
    output?: unknown;
    errorText?: string;
};

function isToolPart(part: PartialUIMessage["parts"][number]): part is ToolPart {
    return (part.type === "dynamic-tool" || part.type === "tool-invocation") && "toolName" in part;
}

function MessagePart(props: {
    part: PartialUIMessage["parts"][number];
    index: number;
    parts: PartialUIMessage["parts"];
    role: string;
}): JSX.Element {
    const part = () => props.part;
    const bubbleVariant = (): "user" | "agent" | "system" => {
        if (props.role === "system") return "system";
        if (props.role === "user") {
            const p = part();
            if (p.type === "text" && "text" in p && isSystemReminderText(p.text)) return "system";
            return "user";
        }
        return "agent";
    };

    // Skip output-available tool parts when the previous part is the matching input-available part.
    // The input-available part will look ahead and merge the output into a single ToolCall.
    const shouldSkip = () => {
        const p = part();
        if (!isToolPart(p) || p.state !== "output-available") return false;
        if (props.index === 0) return false;
        const prev = props.parts[props.index - 1];
        return isToolPart(prev) && prev.state === "input-available" && prev.toolCallId === p.toolCallId;
    };

    // Skip dual-llm-analysis parts that are rendered inside the merged ToolCall
    const shouldSkipDualLlm = () => {
        const p = part();
        if (p.type !== "dual-llm-analysis") return false;
        if (props.index < 1) return false;
        const prev = props.parts[props.index - 1];

        // Case 1: dual-llm directly after input-available (no result part)
        if (
            isToolPart(prev) &&
            prev.state === "input-available" &&
            "toolCallId" in p &&
            (p as DualLlmPart).toolCallId === prev.toolCallId
        ) {
            return true;
        }

        // Case 2: dual-llm after output-available that was merged into input-available
        if (props.index < 2) return false;
        const prevPrev = props.parts[props.index - 2];
        return (
            isToolPart(prev) &&
            prev.state === "output-available" &&
            isToolPart(prevPrev) &&
            prevPrev.state === "input-available" &&
            prevPrev.toolCallId === prev.toolCallId
        );
    };

    return (
        <Show when={!shouldSkip() && !shouldSkipDualLlm()}>
            <Show when={part().type === "text" && "text" in part()}>
                <TextPart text={(part() as { type: "text"; text: string }).text} variant={bubbleVariant()} />
            </Show>

            <Show when={isToolPart(part())}>
                <MergedToolCallPart part={part() as ToolPart} index={props.index} parts={props.parts} />
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
        </Show>
    );
}

function TextPart(props: { text: string; variant: "user" | "agent" | "system" }): JSX.Element {
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
                <TextBubble text={props.text} variant={props.variant} size="xsmall" />
            </Show>
        </>
    );
}

/**
 * Renders an input-available tool part merged with its matching output-available part (if next).
 * Matches the Next.js behavior: one card per tool call showing both parameters and result.
 */
function MergedToolCallPart(props: { part: ToolPart; index: number; parts: PartialUIMessage["parts"] }): JSX.Element {
    const resultPart = (): ToolPart | undefined => {
        const next = props.parts[props.index + 1];
        if (
            next &&
            isToolPart(next) &&
            next.state === "output-available" &&
            next.toolCallId === props.part.toolCallId
        ) {
            return next;
        }
        return undefined;
    };

    const dualLlmPart = (): DualLlmPart | undefined => {
        const rp = resultPart();
        if (!rp) {
            // Check if the next part is a dual-llm-analysis directly (no result part)
            const next = props.parts[props.index + 1];
            if (
                next &&
                next.type === "dual-llm-analysis" &&
                "toolCallId" in next &&
                (next as DualLlmPart).toolCallId === props.part.toolCallId
            ) {
                return next as DualLlmPart;
            }
            return undefined;
        }
        // Result part exists, check the part after it for dual-llm-analysis
        const afterResult = props.parts[props.index + 2];
        if (afterResult && afterResult.type === "dual-llm-analysis") {
            return afterResult as DualLlmPart;
        }
        return undefined;
    };

    const state = (): ToolState => {
        const rp = resultPart();
        const dlp = dualLlmPart();
        if (rp?.errorText) return "output-available";
        if (dlp) return "output-available-dual-llm";
        if (rp) return "output-available";
        return props.part.state;
    };

    const errorText = () => {
        const rp = resultPart();
        if (rp?.errorText) return rp.errorText;
        // Check if output contains an error object
        const output = rp?.output ?? props.part.output;
        if (output && typeof output === "object" && "error" in (output as Record<string, unknown>)) {
            return String((output as Record<string, unknown>).error);
        }
        return props.part.errorText;
    };

    return (
        <ToolCall
            toolName={props.part.toolName}
            state={state()}
            input={props.part.input}
            output={resultPart()?.output ?? props.part.output}
            errorText={errorText()}
            conversations={dualLlmPart()?.conversations}
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

function formatTimestamp(dateStr: string): string {
    try {
        const date = new Date(dateStr);
        return date.toLocaleString(undefined, {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    } catch {
        return dateStr;
    }
}

function isSystemReminderText(text: string): boolean {
    const trimmed = text.trim();
    return trimmed.startsWith("<system-reminder>") || trimmed.startsWith("<system-reminder ");
}

/**
 * Find the start index of the last user→assistant exchange.
 * Walks backwards to find the last assistant message, then finds the user message before it.
 * Everything before that user message is "previous context".
 */
function findLastExchangeStart(messages: PartialUIMessage[]): number {
    if (messages.length <= 2) return 0;

    // Find the last assistant message index
    let lastAssistantIdx = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === "assistant") {
            lastAssistantIdx = i;
            break;
        }
    }
    if (lastAssistantIdx === -1) return 0;

    // Find the last user message before that assistant message
    let lastUserIdx = -1;
    for (let i = lastAssistantIdx - 1; i >= 0; i--) {
        if (messages[i].role === "user") {
            lastUserIdx = i;
            break;
        }
    }
    if (lastUserIdx === -1) return 0;

    return lastUserIdx;
}
