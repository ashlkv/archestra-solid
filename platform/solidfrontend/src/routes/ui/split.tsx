import type { JSX } from "solid-js";
import { HorizontalSplit } from "@/primitives/HorizontalSplit";
import { VerticalSplit } from "@/primitives/VerticalSplit";
import { UiLayout } from "@/ui-demo/UiLayout";

const panelStyle = {
    padding: "1rem",
    background: "var(--muted)",
    "border-radius": "0.5rem",
};

export default function SplitDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="SplitDemo">
                <h2>VerticalSplit</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    A two-column layout using CSS grid with configurable column ratios.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Default columns">
                        <h3>Default (3fr / 7fr)</h3>
                        <VerticalSplit>
                            <div style={panelStyle} data-label="Left panel">Left panel (3fr)</div>
                            <div style={panelStyle} data-label="Right panel">Right panel (7fr)</div>
                        </VerticalSplit>
                    </section>

                    <section data-label="Equal columns">
                        <h3>Equal (5fr / 5fr)</h3>
                        <VerticalSplit columns={[5, 5]}>
                            <div style={panelStyle}>Left panel (5fr)</div>
                            <div style={panelStyle}>Right panel (5fr)</div>
                        </VerticalSplit>
                    </section>

                    <section data-label="Sidebar layout">
                        <h3>Sidebar layout (2fr / 8fr)</h3>
                        <VerticalSplit columns={[2, 8]}>
                            <div style={panelStyle}>Sidebar (2fr)</div>
                            <div style={panelStyle}>Main content area (8fr)</div>
                        </VerticalSplit>
                    </section>
                </div>

                <h2 style={{ "margin-top": "3rem" }}>HorizontalSplit</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    A two-row layout using CSS grid with configurable row ratios.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Default rows">
                        <h3>Default (3fr / 7fr)</h3>
                        <HorizontalSplit>
                            <div style={panelStyle}>Top panel (3fr)</div>
                            <div style={panelStyle}>Bottom panel (7fr)</div>
                        </HorizontalSplit>
                    </section>

                    <section data-label="Equal rows">
                        <h3>Equal (5fr / 5fr)</h3>
                        <HorizontalSplit rows={[5, 5]}>
                            <div style={panelStyle}>Top panel (5fr)</div>
                            <div style={panelStyle}>Bottom panel (5fr)</div>
                        </HorizontalSplit>
                    </section>

                    <section data-label="Fixed height horizontal">
                        <h3>With fixed height (3fr / 7fr)</h3>
                        <HorizontalSplit rows={[3, 7]}>
                            <div style={{ ...panelStyle, height: "100%" }}>Header area (3fr)</div>
                            <div style={{ ...panelStyle, height: "100%" }}>Content area (7fr)</div>
                        </HorizontalSplit>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
