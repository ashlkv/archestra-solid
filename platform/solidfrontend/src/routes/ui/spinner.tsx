import type { JSX } from "solid-js";
import { Spinner } from "@/components/primitives/Spinner";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function SpinnerDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="SpinnerDemo">
                <h2>Spinner</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    An animated loading indicator using the Loader2 icon with configurable size.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Default size">
                        <h3>Default size (16px)</h3>
                        <Spinner />
                    </section>

                    <section data-label="Various sizes">
                        <h3>Various sizes</h3>
                        <div style={{ display: "flex", "align-items": "center", gap: "1.5rem" }}>
                            <div style={{ "text-align": "center" }}>
                                <Spinner size={12} />
                                <p style={{ color: "var(--muted-foreground)", "margin-top": "0.5rem" }}>12px</p>
                            </div>
                            <div style={{ "text-align": "center" }}>
                                <Spinner size={16} />
                                <p style={{ color: "var(--muted-foreground)", "margin-top": "0.5rem" }}>16px</p>
                            </div>
                            <div style={{ "text-align": "center" }}>
                                <Spinner size={20} />
                                <p style={{ color: "var(--muted-foreground)", "margin-top": "0.5rem" }}>20px</p>
                            </div>
                            <div style={{ "text-align": "center" }}>
                                <Spinner size={24} />
                                <p style={{ color: "var(--muted-foreground)", "margin-top": "0.5rem" }}>24px</p>
                            </div>
                            <div style={{ "text-align": "center" }}>
                                <Spinner size={32} />
                                <p style={{ color: "var(--muted-foreground)", "margin-top": "0.5rem" }}>32px</p>
                            </div>
                            <div style={{ "text-align": "center" }}>
                                <Spinner size={48} />
                                <p style={{ color: "var(--muted-foreground)", "margin-top": "0.5rem" }}>48px</p>
                            </div>
                        </div>
                    </section>

                    <section data-label="Inline with text">
                        <h3>Inline with text</h3>
                        <div style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                            <Spinner size={14} />
                            <span>Loading data...</span>
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
