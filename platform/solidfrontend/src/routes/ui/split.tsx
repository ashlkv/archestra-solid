import type { JSX } from "solid-js";
import { Split } from "@/components/primitives/Split";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function SplitDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="SplitDemo">
                <h2>Split</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    A two-column layout using CSS grid with configurable column ratios.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Default columns">
                        <h3>Default (3fr / 7fr)</h3>
                        <Split>
                            <div
                                style={{
                                    padding: "1rem",
                                    background: "var(--muted)",
                                    "border-radius": "0.5rem",
                                }}
                                data-label="Left panel"
                            >
                                Left panel (3fr)
                            </div>
                            <div
                                style={{
                                    padding: "1rem",
                                    background: "var(--muted)",
                                    "border-radius": "0.5rem",
                                }}
                                data-label="Right panel"
                            >
                                Right panel (7fr)
                            </div>
                        </Split>
                    </section>

                    <section data-label="Equal columns">
                        <h3>Equal (5fr / 5fr)</h3>
                        <Split columns={[5, 5]}>
                            <div
                                style={{
                                    padding: "1rem",
                                    background: "var(--muted)",
                                    "border-radius": "0.5rem",
                                }}
                            >
                                Left panel (5fr)
                            </div>
                            <div
                                style={{
                                    padding: "1rem",
                                    background: "var(--muted)",
                                    "border-radius": "0.5rem",
                                }}
                            >
                                Right panel (5fr)
                            </div>
                        </Split>
                    </section>

                    <section data-label="Sidebar layout">
                        <h3>Sidebar layout (2fr / 8fr)</h3>
                        <Split columns={[2, 8]}>
                            <div
                                style={{
                                    padding: "1rem",
                                    background: "var(--muted)",
                                    "border-radius": "0.5rem",
                                }}
                            >
                                Sidebar (2fr)
                            </div>
                            <div
                                style={{
                                    padding: "1rem",
                                    background: "var(--muted)",
                                    "border-radius": "0.5rem",
                                }}
                            >
                                Main content area (8fr)
                            </div>
                        </Split>
                    </section>

                    <section data-label="Reversed layout">
                        <h3>Reversed (7fr / 3fr)</h3>
                        <Split columns={[7, 3]}>
                            <div
                                style={{
                                    padding: "1rem",
                                    background: "var(--muted)",
                                    "border-radius": "0.5rem",
                                }}
                            >
                                Main content (7fr)
                            </div>
                            <div
                                style={{
                                    padding: "1rem",
                                    background: "var(--muted)",
                                    "border-radius": "0.5rem",
                                }}
                            >
                                Side panel (3fr)
                            </div>
                        </Split>
                    </section>

                    <section data-label="With nested content">
                        <h3>With nested content</h3>
                        <Split columns={[3, 7]}>
                            <div
                                style={{
                                    padding: "1rem",
                                    background: "var(--muted)",
                                    "border-radius": "0.5rem",
                                    display: "flex",
                                    "flex-direction": "column",
                                    gap: "0.5rem",
                                }}
                            >
                                <p style={{ "font-weight": "bold" }}>Navigation</p>
                                <p>Dashboard</p>
                                <p>Settings</p>
                                <p>Profiles</p>
                                <p>Tools</p>
                            </div>
                            <div
                                style={{
                                    padding: "1rem",
                                    background: "var(--muted)",
                                    "border-radius": "0.5rem",
                                }}
                            >
                                <p style={{ "font-weight": "bold", "margin-bottom": "0.5rem" }}>Dashboard</p>
                                <p style={{ color: "var(--muted-foreground)" }}>
                                    This demonstrates a typical sidebar + main content layout using the Split component
                                    with nested content in both panels.
                                </p>
                            </div>
                        </Split>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
