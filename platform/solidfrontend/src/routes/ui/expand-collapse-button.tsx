import { createSignal, type JSX } from "solid-js";
import { ExpandCollapseButton } from "@/components/primitives/ExpandCollapseButton";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function ExpandCollapseButtonDemo(): JSX.Element {
    const [expanded1, setExpanded1] = createSignal(false);
    const [expanded2, setExpanded2] = createSignal(true);
    const [pending, setPending] = createSignal(false);
    const [expandedPending, setExpandedPending] = createSignal(false);

    const simulatePending = () => {
        setPending(true);
        setTimeout(() => {
            setPending(false);
            setExpandedPending((previous) => !previous);
        }, 1500);
    };

    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="ExpandCollapseButtonDemo">
                <h2>ExpandCollapseButton</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    A toggle button that switches between expand and collapse icons.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Collapsed state">
                        <h3>Collapsed state (click to toggle)</h3>
                        <div style={{ display: "flex", "align-items": "center", gap: "1rem" }}>
                            <ExpandCollapseButton
                                expanded={expanded1()}
                                onClick={() => setExpanded1((previous) => !previous)}
                            />
                            <span>{expanded1() ? "Expanded" : "Collapsed"}</span>
                        </div>
                    </section>

                    <section data-label="Expanded state">
                        <h3>Expanded state (click to toggle)</h3>
                        <div style={{ display: "flex", "align-items": "center", gap: "1rem" }}>
                            <ExpandCollapseButton
                                expanded={expanded2()}
                                onClick={() => setExpanded2((previous) => !previous)}
                            />
                            <span>{expanded2() ? "Expanded" : "Collapsed"}</span>
                        </div>
                    </section>

                    <section data-label="With pending state">
                        <h3>With pending state</h3>
                        <div style={{ display: "flex", "align-items": "center", gap: "1rem" }}>
                            <ExpandCollapseButton
                                expanded={expandedPending()}
                                pending={pending()}
                                onClick={simulatePending}
                            />
                            <span>{pending() ? "Loading..." : expandedPending() ? "Expanded" : "Collapsed"}</span>
                        </div>
                    </section>

                    <section data-label="Custom sizes">
                        <h3>Custom sizes</h3>
                        <div style={{ display: "flex", "align-items": "center", gap: "1.5rem" }}>
                            <div style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                                <ExpandCollapseButton expanded={false} size={12} />
                                <span>12px</span>
                            </div>
                            <div style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                                <ExpandCollapseButton expanded={false} size={16} />
                                <span>16px (default)</span>
                            </div>
                            <div style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                                <ExpandCollapseButton expanded={false} size={24} />
                                <span>24px</span>
                            </div>
                            <div style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                                <ExpandCollapseButton expanded={false} size={32} />
                                <span>32px</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
