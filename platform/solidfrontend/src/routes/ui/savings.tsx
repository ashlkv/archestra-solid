import type { JSX } from "solid-js";
import { Savings } from "@/components/llm/Savings";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function SavingsDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "800px", margin: "0 auto" }} data-label="SavingsDemo">
                <h1>Savings</h1>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Displays cost with savings percentage. Hover for a tooltip breakdown of model optimization and TOON
                    compression savings.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "1.5rem" }}>
                    <section data-label="No savings">
                        <h3 style={{ "margin-bottom": "0.5rem" }}>No savings</h3>
                        <Savings cost="0.0045" baselineCost="0.0045" toonSkipReason="not_enabled" />
                    </section>

                    <section data-label="Model optimization">
                        <h3 style={{ "margin-bottom": "0.5rem" }}>Model optimization savings</h3>
                        <Savings
                            cost="0.0012"
                            baselineCost="0.0045"
                            baselineModel="gpt-4o"
                            actualModel="gpt-4o-mini"
                            toonSkipReason="no_tool_results"
                        />
                    </section>

                    <section data-label="TOON savings">
                        <h3 style={{ "margin-bottom": "0.5rem" }}>TOON compression savings</h3>
                        <Savings cost="0.0045" baselineCost="0.0045" toonCostSavings="0.0018" toonTokensSaved={1250} />
                    </section>

                    <section data-label="Combined savings">
                        <h3 style={{ "margin-bottom": "0.5rem" }}>Combined savings (model + TOON)</h3>
                        <Savings
                            cost="0.0012"
                            baselineCost="0.0045"
                            baselineModel="claude-opus-4-1-20250805"
                            actualModel="claude-sonnet-4-20250514"
                            toonCostSavings="0.0008"
                            toonTokensSaved={640}
                        />
                    </section>

                    <section data-label="Session variant">
                        <h3 style={{ "margin-bottom": "0.5rem" }}>Session variant</h3>
                        <Savings cost="0.025" baselineCost="0.089" variant="session" />
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
