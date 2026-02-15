// Using a simplified type for tool parts since the generic UIMessagePart
// requires complex type parameters. Both ToolUIPart and DynamicToolUIPart
// share these properties when flattened.
import { createSignal, type JSX, Show } from "solid-js";
import { Check, CircleX, Loader2, Wrench } from "@/components/icons";
import styles from "./MessageTool.module.css";

/**
 * A tool part from UIMessage.parts. Can be either a static ToolUIPart
 * (type: "tool-<name>") or a DynamicToolUIPart (type: "dynamic-tool").
 * Both share the same flat shape: { toolCallId, state, input, output, ... }
 */
export type AnyToolPart = {
    type: string;
    toolCallId: string;
    state: string;
    input?: unknown;
    output?: unknown;
    errorText?: string;
    toolName?: string;
};

export function MessageTool(props: { part: AnyToolPart }): JSX.Element {
    const [open, setOpen] = createSignal(false);

    const fullToolName = () => {
        // DynamicToolUIPart has .toolName; ToolUIPart encodes it in type as "tool-<name>"
        if ("toolName" in props.part && props.part.toolName) {
            return props.part.toolName as string;
        }
        const partType = (props.part as { type: string }).type;
        if (partType.startsWith("tool-")) {
            return partType.slice(5);
        }
        return "unknown";
    };

    const toolName = () => {
        const name = fullToolName();
        const separatorIndex = name.indexOf("__");
        return separatorIndex >= 0 ? name.slice(separatorIndex + 2) : name;
    };

    const serverName = () => {
        const name = fullToolName();
        const separatorIndex = name.indexOf("__");
        return separatorIndex >= 0 ? name.slice(0, separatorIndex) : undefined;
    };

    const state = () => props.part.state;
    const hasOutput = () => state() === "output-available";
    const hasError = () => state() === "output-error";

    const statusClass = () => {
        if (hasError()) return styles.error;
        if (hasOutput()) return styles.completed;
        if (state() === "input-available") return styles.running;
        return "";
    };

    const formatJson = (value: unknown): string => {
        try {
            return JSON.stringify(value, null, 2);
        } catch {
            return String(value);
        }
    };

    return (
        <div class={styles.tool} data-label={`Tool: ${fullToolName()}`}>
            <button type="button" class={styles["tool-header"]} onClick={() => setOpen(!open())}>
                <Wrench size={14} />
                <Show when={serverName()}>
                    <span style={{ color: "color-mix(in srgb, var(--foreground) 50%, transparent)" }}>
                        {serverName()}
                    </span>
                </Show>
                <span class={styles["tool-name"]}>{toolName()}</span>
                <div class={`${styles["tool-status"]} ${statusClass()}`}>
                    <Show when={state() === "input-streaming"}>
                        <Loader2 size={14} />
                        <span>Preparing</span>
                    </Show>
                    <Show when={state() === "input-available"}>
                        <Loader2 size={14} />
                        <span>Running</span>
                    </Show>
                    <Show when={hasOutput()}>
                        <Check size={14} />
                        <span>Completed</span>
                    </Show>
                    <Show when={hasError()}>
                        <CircleX size={14} />
                        <span>Error</span>
                    </Show>
                </div>
            </button>
            <Show when={open()}>
                <div class={styles["tool-content"]}>
                    <div class={styles["tool-section-label"]}>Input</div>
                    <pre class={styles["tool-json"]}>{formatJson(props.part.input)}</pre>
                    <Show when={hasOutput()}>
                        <div class={styles["tool-section-label"]} style={{ "margin-top": "0.5rem" }}>
                            Output
                        </div>
                        <pre class={styles["tool-json"]}>{formatJson(props.part.output)}</pre>
                    </Show>
                    <Show when={hasError() && props.part.errorText}>
                        <div class={styles["tool-section-label"]} style={{ "margin-top": "0.5rem" }}>
                            Error
                        </div>
                        <pre class={`${styles["tool-json"]} ${styles.error}`}>{props.part.errorText}</pre>
                    </Show>
                </div>
            </Show>
        </div>
    );
}
