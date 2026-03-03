import type { JSX } from "solid-js";
import { UiLayout } from "@/components/ui-demo/UiLayout";
import { Tooltip } from "@/components/primitives/Tooltip";
import { Button } from "@/components/primitives/Button";
import { Info, Settings, Trash2 } from "@/components/icons";

export default function TooltipDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="TooltipDemo">
                <h2>Tooltip</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Hover tooltip built on Kobalte. Wraps any element and shows a text label on hover with a 400ms open
                    delay.
                </p>

                <section data-label="Basic usage">
                    <h3>Basic usage</h3>
                    <div style={{ display: "flex", gap: "1rem", "align-items": "center" }}>
                        <Tooltip content="This is a tooltip">
                            <span
                                style={{
                                    padding: "0.5rem 1rem",
                                    border: "1px solid var(--border)",
                                    "border-radius": "0.375rem",
                                    cursor: "default",
                                }}
                                data-label="Basic tooltip target"
                            >
                                Hover me
                            </span>
                        </Tooltip>
                    </div>
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="On buttons">
                    <h3>On buttons</h3>
                    <div style={{ display: "flex", gap: "0.5rem", "align-items": "center" }}>
                        <Tooltip content="Open settings">
                            <Button variant="outline" size="icon-small" data-label="Settings button with tooltip">
                                <Settings size={16} />
                            </Button>
                        </Tooltip>
                        <Tooltip content="More information">
                            <Button variant="outline" size="icon-small" data-label="Info button with tooltip">
                                <Info size={16} />
                            </Button>
                        </Tooltip>
                        <Tooltip content="Delete this item">
                            <Button variant="destructive" size="icon-small" data-label="Delete button with tooltip">
                                <Trash2 size={16} />
                            </Button>
                        </Tooltip>
                    </div>
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="On inline text">
                    <h3>On inline text</h3>
                    <p>
                        You can wrap{" "}
                        <Tooltip content="Tooltips work on inline text too">
                            <span
                                style={{
                                    "text-decoration": "underline dotted",
                                    cursor: "help",
                                }}
                                data-label="Inline tooltip"
                            >
                                any inline element
                            </span>
                        </Tooltip>{" "}
                        with a tooltip for contextual help.
                    </p>
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="Long content">
                    <h3>Long content</h3>
                    <Tooltip content="This tooltip has a longer description that provides more detailed information about the element being hovered">
                        <span
                            style={{
                                padding: "0.5rem 1rem",
                                border: "1px solid var(--border)",
                                "border-radius": "0.375rem",
                                cursor: "default",
                            }}
                            data-label="Long tooltip target"
                        >
                            Hover for a longer tooltip
                        </span>
                    </Tooltip>
                </section>
            </div>
        </UiLayout>
    );
}
