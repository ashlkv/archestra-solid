import type { JSX } from "solid-js";
import { Trash2, X, Ban } from "@/components/icons";
import { DestructiveButton } from "@/components/primitives/DestructiveButton";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function DestructiveButtonDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="DestructiveButtonDemo">
                <h2>DestructiveButton</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Button styled for destructive actions like delete or remove. Wraps Button with a destructive color scheme. Supports ghost, outline, and default variants.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Variants">
                        <h3>Variants</h3>
                        <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem", "margin-top": "0.5rem", "align-items": "center" }}>
                            <DestructiveButton>Ghost (default)</DestructiveButton>
                            <DestructiveButton variant="outline">Outline</DestructiveButton>
                            <DestructiveButton variant="default">Default</DestructiveButton>
                        </div>
                    </section>

                    <section data-label="With icons">
                        <h3>With icons</h3>
                        <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem", "margin-top": "0.5rem", "align-items": "center" }}>
                            <DestructiveButton>
                                <Trash2 size={16} /> Delete
                            </DestructiveButton>
                            <DestructiveButton variant="outline">
                                <X size={16} /> Remove
                            </DestructiveButton>
                            <DestructiveButton variant="default">
                                <Ban size={16} /> Block
                            </DestructiveButton>
                        </div>
                    </section>

                    <section data-label="Sizes">
                        <h3>Sizes</h3>
                        <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem", "margin-top": "0.5rem", "align-items": "center" }}>
                            <DestructiveButton size="large">Large</DestructiveButton>
                            <DestructiveButton size="medium">Medium</DestructiveButton>
                            <DestructiveButton size="small">Small</DestructiveButton>
                            <DestructiveButton size="xsmall">Extra small</DestructiveButton>
                        </div>
                    </section>

                    <section data-label="Icon only">
                        <h3>Icon only</h3>
                        <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem", "margin-top": "0.5rem", "align-items": "center" }}>
                            <DestructiveButton size="icon" tooltip="Delete item">
                                <Trash2 size={16} />
                            </DestructiveButton>
                            <DestructiveButton size="icon-small" tooltip="Remove">
                                <X size={14} />
                            </DestructiveButton>
                            <DestructiveButton size="icon-xsmall" tooltip="Block">
                                <Ban size={12} />
                            </DestructiveButton>
                        </div>
                    </section>

                    <section data-label="Disabled">
                        <h3>Disabled</h3>
                        <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem", "margin-top": "0.5rem", "align-items": "center" }}>
                            <DestructiveButton disabled>Ghost disabled</DestructiveButton>
                            <DestructiveButton variant="outline" disabled>Outline disabled</DestructiveButton>
                            <DestructiveButton variant="default" disabled>Default disabled</DestructiveButton>
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
