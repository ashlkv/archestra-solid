import type { JSX } from "solid-js";
import { AgentMiniBadge } from "@/components/llm/AgentMiniBadge";
import { UiLayout } from "@/components/ui-demo/UiLayout";

const AGENTS = [
    { id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", name: "Code Review" },
    { id: "b2c3d4e5-f6a7-8901-bcde-f12345678901", name: "Security Scanner" },
    { id: "c3d4e5f6-a7b8-9012-cdef-123456789012", name: "Data Pipeline" },
    { id: "d4e5f6a7-b8c9-0123-defa-234567890123", name: "API Gateway" },
    { id: "e5f6a7b8-c9d0-1234-efab-345678901234", name: "Frontend Dev" },
    { id: "f6a7b8c9-d0e1-2345-fabc-456789012345", name: "QA Bot" },
    { id: "17a8b9c0-e1f2-3456-abcd-567890123456", name: "Deployment Manager" },
    { id: "28b9c0d1-f2a3-4567-bcde-678901234567", name: "Log Analyzer" },
];

export default function AgentMiniBadgeDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="AgentMiniBadgeDemo">
                <h2>AgentMiniBadge</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    A compact colored badge showing agent initials. Color is deterministic based on agent ID. Hover to
                    see the full name in a tooltip.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Color variety">
                        <h3>Color variety</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.5rem" }}>
                            Each badge derives its color from the agent ID, producing a stable palette across renders.
                        </p>
                        <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.75rem", "margin-top": "0.5rem" }}>
                            {AGENTS.map((agent) => (
                                <div
                                    style={{
                                        display: "flex",
                                        "flex-direction": "column",
                                        "align-items": "center",
                                        gap: "0.25rem",
                                    }}
                                >
                                    <AgentMiniBadge agentId={agent.id} agentName={agent.name} />
                                    <span
                                        style={{
                                            color: "var(--muted-foreground)",
                                            "font-size": "var(--small-font-size)",
                                        }}
                                    >
                                        {agent.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section data-label="Inline usage">
                        <h3>Inline usage</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.5rem" }}>
                            Badges sit naturally alongside text.
                        </p>
                        <div
                            style={{ display: "flex", "align-items": "center", gap: "0.5rem", "margin-top": "0.5rem" }}
                        >
                            <span>Assigned to</span>
                            <AgentMiniBadge agentId={AGENTS[0].id} agentName={AGENTS[0].name} />
                            <span>and</span>
                            <AgentMiniBadge agentId={AGENTS[1].id} agentName={AGENTS[1].name} />
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
