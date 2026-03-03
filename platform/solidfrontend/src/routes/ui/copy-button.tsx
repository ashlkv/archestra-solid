import type { JSX } from "solid-js";
import { CopyButton } from "@/components/primitives/CopyButton";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function CopyButtonDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="CopyButtonDemo">
                <h2>CopyButton</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Button that copies text to the clipboard with visual feedback. Supports icon sizes, labels, and disabled state.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Icon sizes">
                        <h3>Icon sizes</h3>
                        <div style={{ display: "flex", "align-items": "center", gap: "1rem", "margin-top": "0.5rem" }}>
                            <div style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                                <span>icon:</span>
                                <CopyButton text="Hello from icon size" size="icon" />
                            </div>
                            <div style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                                <span>icon-small:</span>
                                <CopyButton text="Hello from icon-small size" size="icon-small" />
                            </div>
                            <div style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                                <span>icon-xsmall:</span>
                                <CopyButton text="Hello from icon-xsmall size" size="icon-xsmall" />
                            </div>
                        </div>
                    </section>

                    <section data-label="With label">
                        <h3>With label</h3>
                        <div style={{ display: "flex", "flex-direction": "column", gap: "0.5rem", "margin-top": "0.5rem" }}>
                            <div>
                                <CopyButton text="sk-1234567890abcdef" label="Copy API key" />
                            </div>
                            <div>
                                <CopyButton text='{"id": 1, "name": "example"}' label="Copy JSON" />
                            </div>
                        </div>
                    </section>

                    <section data-label="Inline with text">
                        <h3>Inline with text</h3>
                        <div style={{ display: "flex", "flex-direction": "column", gap: "0.75rem", "margin-top": "0.5rem" }}>
                            <div style={{ display: "flex", "align-items": "center", gap: "0.5rem", padding: "0.5rem", background: "var(--muted)", "border-radius": "0.375rem" }}>
                                <code style={{ flex: 1 }}>npm install @archestra/sdk</code>
                                <CopyButton text="npm install @archestra/sdk" size="icon-small" />
                            </div>
                            <div style={{ display: "flex", "align-items": "center", gap: "0.5rem", padding: "0.5rem", background: "var(--muted)", "border-radius": "0.375rem" }}>
                                <code style={{ flex: 1 }}>sk-proj-abc123def456...</code>
                                <CopyButton text="sk-proj-abc123def456ghi789jkl012" size="icon-small" />
                            </div>
                        </div>
                    </section>

                    <section data-label="Disabled">
                        <h3>Disabled</h3>
                        <div style={{ display: "flex", "align-items": "center", gap: "1rem", "margin-top": "0.5rem" }}>
                            <CopyButton text="Cannot copy this" disabled />
                            <CopyButton text="Cannot copy this" label="Disabled with label" disabled />
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
