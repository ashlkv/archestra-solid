import { createSignal, type JSX, Show } from "solid-js";
import { ChevronDown, ChevronRight, GitCompareArrows } from "@/components/icons";
import { Button } from "@/components/primitives/Button";
import { CopyButton } from "@/components/primitives/CopyButton";
import { HelpTrigger } from "@/components/primitives/HelpTrigger";
import { Tooltip } from "@/components/primitives/Tooltip";
import { JsonDiffViewer } from "./JsonDiffViewer";
import { JsonHighlight } from "./JsonHighlight";

export function JsonSection(props: {
    title: string;
    data: unknown;
    defaultOpen?: boolean;
    /** When false, the section is always open with no chevron toggle. Defaults to true. */
    expandable?: boolean;
    /** When provided, enables a diff toggle that shows side-by-side comparison against this data */
    diffOriginal?: unknown;
    /** When provided, shows a help icon next to the title with this content in a hover card */
    help?: JSX.Element;
}): JSX.Element {
    const expandable = () => props.expandable !== false;
    const [isOpen, setIsOpen] = createSignal(expandable() ? (props.defaultOpen ?? false) : true);
    const [showDiff, setShowDiff] = createSignal(false);

    const jsonString = () => {
        try {
            return JSON.stringify(props.data, null, 2);
        } catch {
            return String(props.data);
        }
    };

    const contentVisible = () => !expandable() || isOpen();

    return (
        <div
            data-label={`JsonSection: ${props.title}`}
            style={{ border: "1px solid var(--border)", "border-radius": "var(--radius)", overflow: "hidden" }}
        >
            <div
                style={{
                    display: "flex",
                    "align-items": "center",
                    gap: "0.5rem",
                    padding: expandable() ? "0.75rem 0.5rem 0.75rem 1rem" : "0.5rem 0.5rem 0.5rem 1rem",
                    background: "transparent",
                }}
            >
                <Show when={expandable()}>
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen())}
                        style={{
                            display: "flex",
                            "align-items": "center",
                            gap: "0.5rem",
                            flex: "1",
                            "min-width": "0",
                            border: "none",
                            background: "transparent",
                            color: "var(--foreground)",
                            "font-weight": "bold",
                            "font-size": "var(--font-size-small)",
                            cursor: "pointer",
                            "text-align": "left",
                            padding: "0",
                        }}
                    >
                        <Show when={isOpen()}>
                            <ChevronDown style={{ width: "16px", height: "16px", "flex-shrink": "0" }} />
                        </Show>
                        <Show when={!isOpen()}>
                            <ChevronRight style={{ width: "16px", height: "16px", "flex-shrink": "0" }} />
                        </Show>
                        {props.title}
                    </button>
                    <Show when={props.help}>
                        <HelpTrigger>{props.help}</HelpTrigger>
                    </Show>
                </Show>
                <Show when={!expandable()}>
                    <span
                        style={{
                            display: "flex",
                            "align-items": "center",
                            gap: "0.5rem",
                            flex: "1",
                            "min-width": "0",
                            "font-weight": "bold",
                            "font-size": "var(--font-size-small)",
                            color: "var(--foreground)",
                        }}
                    >
                        {props.title}
                        <Show when={props.help}>
                            <HelpTrigger>{props.help}</HelpTrigger>
                        </Show>
                    </span>
                </Show>
                <div style={{ display: "flex", "align-items": "center", gap: "0.25rem", "flex-shrink": "0" }}>
                    <Show when={props.diffOriginal !== undefined}>
                        <Tooltip content={showDiff() ? "Hide diff" : "Show diff against original"}>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowDiff(!showDiff())}
                                style={{
                                    color: showDiff() ? "var(--secondary)" : undefined,
                                }}
                            >
                                <GitCompareArrows size={14} />
                            </Button>
                        </Tooltip>
                    </Show>
                    <CopyButton text={jsonString()} />
                </div>
            </div>
            <Show when={contentVisible()}>
                <Show
                    when={showDiff() && props.diffOriginal !== undefined}
                    fallback={<JsonHighlight code={jsonString()} />}
                >
                    <JsonDiffViewer original={props.diffOriginal} modified={props.data} />
                </Show>
            </Show>
        </div>
    );
}
