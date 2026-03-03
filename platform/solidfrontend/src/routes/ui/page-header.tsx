import type { JSX } from "solid-js";
import { PageHeader } from "@/components/primitives/PageHeader";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function PageHeaderDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="PageHeaderDemo">
                <h2>PageHeader</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    A page header with a title and optional description, separated by a dot.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Title only">
                        <h3>Title only</h3>
                        <PageHeader title="MCP servers" />
                    </section>

                    <section data-label="Title with description">
                        <h3>Title with description</h3>
                        <PageHeader title="Profiles" description="Manage LLM proxy profiles and their tool assignments" />
                    </section>

                    <section data-label="Long description">
                        <h3>Long description</h3>
                        <PageHeader
                            title="Cost statistics"
                            description="View detailed token usage analytics with time series charts and custom date range filtering"
                        />
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
