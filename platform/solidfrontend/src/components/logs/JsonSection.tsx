import { createSignal, type JSX, Show } from "solid-js";
import { ChevronDown, ChevronRight } from "@/components/icons";
import { CopyButton } from "@/components/primitives/CopyButton";

export function JsonSection(props: { title: string; data: unknown; defaultOpen?: boolean }): JSX.Element {
    const [isOpen, setIsOpen] = createSignal(props.defaultOpen ?? false);

    const jsonString = () => {
        try {
            return JSON.stringify(props.data, null, 2);
        } catch {
            return String(props.data);
        }
    };

    return (
        <div
            data-label={`JsonSection: ${props.title}`}
            style={{ border: "1px solid var(--border)", "border-radius": "var(--radius)" }}
        >
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen())}
                style={{
                    display: "flex",
                    "align-items": "center",
                    gap: "0.5rem",
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "none",
                    background: "transparent",
                    color: "var(--foreground)",
                    "font-weight": "bold",
                    "font-size": "var(--font-size-small)",
                    cursor: "pointer",
                    "text-align": "left",
                }}
            >
                <Show when={isOpen()}>
                    <ChevronDown style={{ width: "16px", height: "16px" }} />
                </Show>
                <Show when={!isOpen()}>
                    <ChevronRight style={{ width: "16px", height: "16px" }} />
                </Show>
                {props.title}
            </button>
            <Show when={isOpen()}>
                <div style={{ padding: "0 1rem 0.75rem 1rem" }}>
                    <div style={{ display: "flex", "justify-content": "flex-end", "margin-bottom": "0.5rem" }}>
                        <CopyButton text={jsonString()} />
                    </div>
                    <pre
                        style={{
                            "font-family": "var(--font-mono)",
                            "font-size": "var(--font-size-xsmall)",
                            background: "var(--muted)",
                            padding: "1rem",
                            "border-radius": "var(--radius)",
                            overflow: "auto",
                            "max-height": "400px",
                            "white-space": "pre-wrap",
                            "word-break": "break-all",
                        }}
                    >
                        {jsonString()}
                    </pre>
                </div>
            </Show>
        </div>
    );
}
