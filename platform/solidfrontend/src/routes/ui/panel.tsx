import type { JSX } from "solid-js";
import { Panel } from "@/components/primitives/Panel";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function PanelDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="PanelDemo">
                <h2>Panel</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem", "max-width": "42rem" }}>
                    Simple white surface container for grouping related content.
                </p>

                <div style={{ display: "grid", gap: "1.5rem" }}>
                    <Panel data-label="Default panel">
                        <h3 style={{ margin: "0 0 0.5rem 0" }}>Default panel</h3>
                        <p style={{ margin: 0, color: "var(--muted-foreground)" }}>
                            Use this as a lightweight section wrapper or content surface.
                        </p>
                    </Panel>

                    <Panel data-label="Stacked panel">
                        <div style={{ display: "grid", gap: "0.75rem" }}>
                            <div>
                                <strong>Title</strong>
                            </div>
                            <div style={{ color: "var(--muted-foreground)" }}>
                                Panels intentionally stay simple and neutral.
                            </div>
                        </div>
                    </Panel>
                </div>
            </div>
        </UiLayout>
    );
}
