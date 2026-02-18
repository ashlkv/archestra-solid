import { createSignal, For, type JSX, Show } from "solid-js";
import { ChevronDown, CircleCheck, CircleX, Clock } from "@/components/icons";
import { JsonHighlight } from "@/components/logs/JsonHighlight";
import { Button } from "@/components/primitives/Button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/primitives/Collapsible";
import { CopyButton } from "@/components/primitives/CopyButton";
import { Markdown } from "@/components/primitives/Markdown";
import { CallPolicyToggle } from "@/components/tools/policy/CallPolicyToggle";
import { OriginBadge } from "@/components/tools/OriginBadge";
import { ResultPolicySelect } from "@/components/tools/policy/ResultPolicySelect";
import { ToolName } from "@/components/tools/ToolName";
import { useResultPolicies, useToolCallPolicies } from "@/lib/policy.query";
import { useTools } from "@/lib/tool.query";
import type { CallPolicy, ResultPolicy, ToolWithAssignments } from "@/types";
import styles from "./ToolCall.module.css";

export type ToolState = "input-available" | "output-available" | "output-available-dual-llm" | "output-denied";

export function ToolCall(props: {
    toolName: string;
    state: ToolState;
    input?: unknown;
    output?: unknown;
    errorText?: string;
    conversations?: Array<{ role: "user" | "assistant"; content: string | unknown }>;
    defaultOpen?: boolean;
}): JSX.Element {
    const { data: tools } = useTools(() => ({ limit: 10, offset: 0, search: shortToolName(props.toolName) }));
    const { data: callPolicies } = useToolCallPolicies();
    const { data: resultPolicies } = useResultPolicies();

    const tool = () => tools()?.find((t) => t.name === props.toolName);
    const callPolicy = () => findPolicy(tool(), callPolicies());
    const resultPolicy = () => findPolicy(tool(), resultPolicies());

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
                        <StatusIcon state={props.state} />
                        <ToolName
                            name={props.toolName}
                            tool={
                                tool()
                                    ? { description: tool()!.description, parameters: tool()!.parameters }
                                    : undefined
                            }
                        />
                    </div>
                    <div class={styles["trigger-right"]}>
                        <OriginBadge toolName={props.toolName} />
                        <Show when={hasContent()}>
                            <ChevronDown class={styles.chevron} style={{ width: "16px", height: "16px" }} />
                        </Show>
                    </div>
                </div>
            </CollapsibleTrigger>
            <Show when={hasContent()}>
                <CollapsibleContent>
                    <Show when={props.conversations && props.conversations.length > 0}>
                        <ToolConversations conversations={props.conversations!} label="Conversation" />
                    </Show>
                    <Show when={props.input !== undefined && Object.keys(props.input as object).length > 0}>
                        <ToolInputSection input={props.input} toolId={tool()?.id} callPolicy={callPolicy()} />
                    </Show>
                    <Show when={props.output !== undefined || props.errorText}>
                        <ToolOutputSection
                            output={props.output}
                            errorText={props.errorText}
                            toolId={tool()?.id}
                            resultPolicy={resultPolicy()}
                        />
                    </Show>
                </CollapsibleContent>
            </Show>
        </Collapsible>
    );
}

function StatusIcon(props: { state: ToolState }): JSX.Element {
    const size = { width: "18px", height: "18px", "flex-shrink": "0" };
    const title = () => {
        const labels: Record<ToolState, string> = {
            "input-available": "Running",
            "output-available": "Completed",
            "output-available-dual-llm": "Completed with dual LLM",
            "output-denied": "Denied",
        };
        return labels[props.state] ?? props.state;
    };

    return (
        <>
            <Show when={props.state === "input-available"}>
                <Clock style={{ ...size, color: "var(--muted-foreground)" }} title={title()} />
            </Show>
            <Show when={props.state === "output-available" || props.state === "output-available-dual-llm"}>
                <CircleCheck style={{ ...size, color: "#16a34a" }} title={title()} />
            </Show>
            <Show when={props.state === "output-denied"}>
                <CircleX style={{ ...size, color: "var(--destructive)" }} title={title()} />
            </Show>
        </>
    );
}

function ToolInputSection(props: {
    input: unknown;
    toolId?: string;
    callPolicy?: { id: string; action: string };
}): JSX.Element {
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
                <div class={styles["section-actions"]}>
                    <Show when={props.toolId}>
                        <span class={styles["policy-label"]}>Call policy</span>
                        <CallPolicyToggle
                            toolId={props.toolId!}
                            policyId={props.callPolicy?.id}
                            value={props.callPolicy?.action as any}
                            size="xsmall"
                        />
                        <span class={styles.divider} />
                    </Show>
                    <CopyButton text={jsonString()} />
                </div>
            </div>
            <div class={styles["code-block-wrapper"]}>
                <JsonHighlight code={jsonString()} lineNumbers={false} />
            </div>
        </div>
    );
}

function ToolOutputSection(props: {
    output?: unknown;
    errorText?: string;
    toolId?: string;
    resultPolicy?: { id: string; action: string };
}): JSX.Element {
    const [isExpanded, setIsExpanded] = createSignal(false, { name: "isExpanded" });
    const MAX_LINES = 50;

    const parsedOutput = (): unknown => {
        if (props.output === undefined) return undefined;
        if (typeof props.output === "object") return props.output;
        if (typeof props.output === "string") {
            try {
                return JSON.parse(props.output);
            } catch {
                return props.output;
            }
        }
        return props.output;
    };

    const isJson = () => {
        const parsed = parsedOutput();
        return parsed !== undefined && typeof parsed === "object" && parsed !== null;
    };

    const fullText = (): string => {
        if (props.errorText) return props.errorText;
        const parsed = parsedOutput();
        if (parsed === undefined) return "";
        if (typeof parsed === "object" && parsed !== null) return JSON.stringify(parsed, null, 2);
        return String(parsed);
    };

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
                <div class={styles["section-actions"]}>
                    <Show when={props.toolId && !props.errorText}>
                        <span class={styles["policy-label"]}>Result policy</span>
                        <ResultPolicySelect
                            toolId={props.toolId!}
                            policyId={props.resultPolicy?.id}
                            value={props.resultPolicy?.action as any}
                            size="xsmall"
                        />
                        <span class={styles.divider} />
                    </Show>
                    <CopyButton text={fullText()} />
                </div>
            </div>
            <Show when={props.errorText}>
                <pre class={`${styles["code-block"]} ${styles.error}`}>{props.errorText}</pre>
            </Show>
            <Show when={!props.errorText}>
                <Show
                    when={isJson()}
                    fallback={
                        <div class={styles["markdown-wrapper"]}>
                            <Markdown size="xsmall">{fullText()}</Markdown>
                        </div>
                    }
                >
                    <div class={styles["output-wrapper"]}>
                        <div class={styles["code-block-wrapper"]}>
                            <JsonHighlight code={displayText()} lineNumbers={false} />
                        </div>
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
                </Show>
            </Show>
        </div>
    );
}

/** Extract just the method name from a fully qualified tool name (e.g. "server__method" -> "method") */
function shortToolName(name: string): string {
    const lastSep = name.lastIndexOf("__");
    return lastSep !== -1 ? name.slice(lastSep + 2) : name;
}

/** Find a policy (call or result) for a tool, excluding conditional policies */
function findPolicy<P extends { toolId: string; conditions: unknown[] }>(
    tool: ToolWithAssignments | undefined,
    policies: P[] | undefined,
): { id: string; action: string } | undefined {
    if (!tool || !policies) return undefined;
    const p = policies.find((p) => p.toolId === tool.id && p.conditions.length === 0);
    return p ? { id: (p as any).id, action: (p as any).action } : undefined;
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
