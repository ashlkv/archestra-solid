import type { JSX } from "solid-js";
import { HelpTrigger } from "@/components/primitives/HelpTrigger";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function HelpTriggerDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="HelpTriggerDemo">
                <h2>HelpTrigger</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    A small help icon that shows a hover card with explanatory text.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Inline with text">
                        <h3>Inline with text</h3>
                        <div style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                            <span>Token limit</span>
                            <HelpTrigger>
                                The maximum number of tokens that can be used per request. This applies to both input
                                and output tokens combined.
                            </HelpTrigger>
                        </div>
                    </section>

                    <section data-label="Default size">
                        <h3>Default size (14px)</h3>
                        <div style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                            <span>Profile name</span>
                            <HelpTrigger>
                                A unique identifier for this profile. Used to reference the profile in API calls and
                                MCP gateway URLs.
                            </HelpTrigger>
                        </div>
                    </section>

                    <section data-label="Custom size">
                        <h3>Custom size (20px)</h3>
                        <div style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                            <span>Dual LLM mode</span>
                            <HelpTrigger size={20}>
                                When enabled, a secondary LLM reviews all tool calls before execution. This adds
                                latency but provides an additional security layer.
                            </HelpTrigger>
                        </div>
                    </section>

                    <section data-label="Rich content">
                        <h3>Rich content</h3>
                        <div style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                            <span>TOON format</span>
                            <HelpTrigger>
                                <div style={{ display: "flex", "flex-direction": "column", gap: "0.5rem" }}>
                                    <strong>Token-Oriented Object Notation</strong>
                                    <p>Reduces token usage by 30-60% for uniform arrays of objects.</p>
                                    <p style={{ color: "var(--muted-foreground)" }}>
                                        Particularly useful for structured data from database or API tools.
                                    </p>
                                </div>
                            </HelpTrigger>
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
