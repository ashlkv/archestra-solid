import { createSignal, For, type JSX, Show } from "solid-js";
import { ChevronDown, Circle, CircleCheck, CircleX, Clock, Wrench } from "@/components/icons";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/primitives/Collapsible";
import { CopyButton } from "@/components/primitives/CopyButton";
import styles from "./ToolCall.module.css";

type ToolState = "input-available" | "output-available" | "output-available-dual-llm" | "output-denied";

export function ToolCall(props: {
    toolName: string;
    state: ToolState;
    input?: unknown;
    output?: unknown;
    errorText?: string;
    conversations?: Array<{ role: "user" | "assistant"; content: string | unknown }>;
    defaultOpen?: boolean;
}): JSX.Element {
    const hasContent = () =>
        (props.input !== undefined && props.input !== null && Object.keys(props.input as object).length > 0) ||
        props.output !== undefined ||
        props.errorText !== undefined ||
        (props.conversations !== undefined && props.conversations.length > 0);

    return (
        <Collapsible defaultOpen={props.defaultOpen ?? false} class={styles.root}>
            <CollapsibleTrigger class={styles.trigger}>
                <div class={styles["trigger-content"]}>
                    <div class={styles["trigger-left"]}>
                        <Wrench style={{ width: "16px", height: "16px", color: "var(--muted-foreground)" }} />
                        <span class={styles["tool-name"]}>{props.toolName}</span>
                        <StatusBadge state={props.state} />
                    </div>
                    <Show when={props.errorText}>
                        <div class={styles["error-text"]}>{props.errorText}</div>
                    </Show>
                </div>
                <Show when={hasContent()}>
                    <ChevronDown class={styles.chevron} style={{ width: "16px", height: "16px" }} />
                </Show>
            </CollapsibleTrigger>
            <Show when={hasContent()}>
                <CollapsibleContent>
                    <Show when={props.conversations && props.conversations.length > 0}>
                        <ToolConversations conversations={props.conversations!} label="Conversation" />
                    </Show>
                    <Show when={props.input !== undefined && Object.keys(props.input as object).length > 0}>
                        <ToolInputSection input={props.input} />
                    </Show>
                    <Show when={props.output !== undefined || props.errorText}>
                        <ToolOutputSection output={props.output} errorText={props.errorText} />
                    </Show>
                </CollapsibleContent>
            </Show>
        </Collapsible>
    );
}

function StatusBadge(props: { state: ToolState }): JSX.Element {
    const label = () => {
        const labels: Record<ToolState, string> = {
            "input-available": "Running",
            "output-available": "Completed",
            "output-available-dual-llm": "Completed with dual LLM",
            "output-denied": "Denied",
        };
        return labels[props.state] ?? props.state;
    };

    const icon = (): JSX.Element => {
        const size = { width: "14px", height: "14px" };
        if (props.state === "input-available") return <Clock style={{ ...size, color: "var(--muted-foreground)" }} />;
        if (props.state === "output-available" || props.state === "output-available-dual-llm")
            return <CircleCheck style={{ ...size, color: "var(--success-foreground)" }} />;
        if (props.state === "output-denied") return <CircleX style={{ ...size, color: "var(--warning-foreground)" }} />;
        return <Circle style={{ ...size, color: "var(--muted-foreground)" }} />;
    };

    return (
        <Badge variant="muted" class={styles["status-badge"]}>
            {icon()}
            {label()}
        </Badge>
    );
}

function ToolInputSection(props: { input: unknown }): JSX.Element {
    const jsonString = () => {
        try {
            return JSON.stringify(props.input, null, 2);
        } catch {
            return String(props.input);
        }
    };

    return (
        <div class={styles.section}>
            <div class={styles["section-header"]}>
                <h4 class={styles["section-label"]}>Parameters</h4>
                <CopyButton text={jsonString()} />
            </div>
            <pre class={styles["code-block"]}>{jsonString()}</pre>
        </div>
    );
}

function ToolOutputSection(props: { output?: unknown; errorText?: string }): JSX.Element {
    const [isExpanded, setIsExpanded] = createSignal(false);
    const MAX_LINES = 50;

    const formatOutput = (): string => {
        if (props.errorText) return props.errorText;
        if (props.output === undefined) return "";
        try {
            let formatted = props.output;
            if (typeof formatted === "string") {
                try {
                    formatted = JSON.parse(formatted);
                } catch {
                    // Not valid JSON, use as-is
                }
            }
            return typeof formatted === "object" ? JSON.stringify(formatted, null, 2) : String(formatted);
        } catch {
            return String(props.output);
        }
    };

    const fullText = () => formatOutput();
    const lines = () => fullText().split("\n");
    const isLarge = () => lines().length > MAX_LINES;

    const displayText = () => {
        if (isExpanded() || !isLarge()) return fullText();
        return `${lines().slice(0, MAX_LINES).join("\n")}\n... (${lines().length - MAX_LINES} more lines)`;
    };

    return (
        <div class={styles.section}>
            <div class={styles["section-header"]}>
                <h4 class={styles["section-label"]}>{props.errorText ? "Error" : "Result"}</h4>
                <CopyButton text={fullText()} />
            </div>
            <div class={styles["output-wrapper"]}>
                <pre class={styles["code-block"]} classList={{ [styles.error]: !!props.errorText }}>
                    {displayText()}
                </pre>
                <Show when={isLarge()}>
                    <div
                        class={styles["expand-overlay"]}
                        classList={{ [styles["expand-overlay-collapsed"]]: !isExpanded() }}
                    >
                        <Button
                            variant="outline"
                            size="small"
                            onClick={(event) => {
                                event.stopPropagation();
                                setIsExpanded(!isExpanded());
                            }}
                        >
                            {isExpanded() ? "Show less" : `Show ${lines().length - MAX_LINES} more lines`}
                        </Button>
                    </div>
                </Show>
            </div>
        </div>
    );
}

function ToolConversations(props: {
    conversations: Array<{ role: "user" | "assistant"; content: string | unknown }>;
    label: string;
}): JSX.Element {
    return (
        <div class={styles.section}>
            <h4 class={styles["section-label"]}>{props.label}</h4>
            <div class={styles["conversations-container"]}>
                <For each={props.conversations}>
                    {(conversation) => {
                        const contentString = () =>
                            typeof conversation.content === "string"
                                ? conversation.content
                                : JSON.stringify(conversation.content);

                        return (
                            <div
                                class={styles["conversation-row"]}
                                classList={{ [styles["conversation-assistant"]]: conversation.role === "assistant" }}
                            >
                                <div
                                    class={styles["conversation-bubble"]}
                                    classList={{
                                        [styles["bubble-assistant"]]: conversation.role === "assistant",
                                        [styles["bubble-user"]]: conversation.role === "user",
                                    }}
                                >
                                    {contentString()}
                                </div>
                            </div>
                        );
                    }}
                </For>
            </div>
        </div>
    );
}
