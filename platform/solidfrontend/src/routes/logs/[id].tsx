import { A, useParams } from "@solidjs/router";
import { For, type JSX, Show } from "solid-js";
import { ArrowLeft } from "@/components/icons";
import { ChatViewer } from "@/components/logs/chat/ChatViewer";
import { JsonSection } from "@/components/logs/JsonSection";
import { Savings } from "@/components/logs/Savings";
import { Badge } from "@/components/primitives/Badge";
import { PageHeader } from "@/components/primitives/PageHeader";
import { Spinner } from "@/components/primitives/Spinner";
import { useAgents } from "@/lib/agent.query";
import { useDualLlmResultsByInteraction } from "@/lib/dual-llm-result.query";
import { useInteraction } from "@/lib/interaction.query";
import { calculateCostSavings, DynamicInteraction, formatDate } from "@/lib/interaction.utils";
import type { Agent } from "@/types";

export default function InteractionDetailPage(): JSX.Element {
    const params = useParams<{ id: string }>();

    const { data: interaction, query: interactionQuery } = useInteraction(() => ({ interactionId: params.id }));
    const { data: dualLlmResults } = useDualLlmResultsByInteraction(() => ({ interactionId: params.id }));
    const { data: agents } = useAgents();

    const dynamicInteraction = () => {
        const i = interaction();
        if (!i) return undefined;
        try {
            return new DynamicInteraction(i);
        } catch {
            return undefined;
        }
    };

    const getProfileName = (profileId: string): string => {
        const agentList = agents() ?? [];
        return agentList.find((a: Agent) => a.id === profileId)?.name ?? profileId;
    };

    const toolsUsed = () => dynamicInteraction()?.getToolNamesUsed() ?? [];
    const toolsRefused = () => dynamicInteraction()?.getToolNamesRefused() ?? [];

    const uiMessages = () => {
        const di = dynamicInteraction();
        if (!di) return [];
        return di.mapToUiMessages(dualLlmResults() ?? []);
    };

    return (
        <>
            <div style={{ display: "flex", "align-items": "center", gap: "0.5rem", "margin-bottom": "1rem" }}>
                <A href="/logs/llm-proxy" style={{ color: "var(--muted-foreground)" }}>
                    <ArrowLeft style={{ width: "20px", height: "20px" }} />
                </A>
                <PageHeader title="Interaction" />
            </div>

            <Show when={interactionQuery.pending}>
                <div style={{ display: "flex", "justify-content": "center", padding: "3rem" }}>
                    <Spinner />
                </div>
            </Show>

            <Show when={interactionQuery.error}>
                <div style={{ color: "var(--destructive)", padding: "1rem" }}>
                    Failed to load interaction: {interactionQuery.error?.message}
                </div>
            </Show>

            <Show when={interaction()}>
                {/* Metadata */}
                <div
                    data-label="Metadata"
                    style={{
                        border: "1px solid var(--border)",
                        "border-radius": "var(--radius)",
                        padding: "1.5rem",
                        "margin-bottom": "1.5rem",
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            "grid-template-columns": "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "1.5rem",
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    "font-size": "var(--font-size-xsmall)",
                                    color: "var(--muted-foreground)",
                                    "margin-bottom": "0.25rem",
                                }}
                            >
                                Profile
                            </div>
                            <Badge variant="outline">{getProfileName(interaction()!.profileId)}</Badge>
                        </div>
                        <Show when={interaction()!.externalAgentId}>
                            <div>
                                <div
                                    style={{
                                        "font-size": "var(--font-size-xsmall)",
                                        color: "var(--muted-foreground)",
                                        "margin-bottom": "0.25rem",
                                    }}
                                >
                                    External agent
                                </div>
                                <div>
                                    {(interaction()! as any).externalAgentIdLabel ?? interaction()!.externalAgentId}
                                </div>
                            </div>
                        </Show>
                        <div>
                            <div
                                style={{
                                    "font-size": "var(--font-size-xsmall)",
                                    color: "var(--muted-foreground)",
                                    "margin-bottom": "0.25rem",
                                }}
                            >
                                Provider &amp; Model
                            </div>
                            <div>
                                <Badge variant="muted">{dynamicInteraction()?.provider ?? "Unknown"}</Badge>{" "}
                                <span style={{ "font-size": "var(--font-size-small)" }}>
                                    {dynamicInteraction()?.modelName ?? "Unknown"}
                                </span>
                            </div>
                        </div>
                        <Show when={toolsUsed().length > 0}>
                            <div>
                                <div
                                    style={{
                                        "font-size": "var(--font-size-xsmall)",
                                        color: "var(--muted-foreground)",
                                        "margin-bottom": "0.25rem",
                                    }}
                                >
                                    Tools used
                                </div>
                                <div style={{ display: "flex", gap: "0.25rem", "flex-wrap": "wrap" }}>
                                    <For each={toolsUsed()}>
                                        {(toolName) => <Badge variant="muted">{toolName}</Badge>}
                                    </For>
                                </div>
                            </div>
                        </Show>
                        <Show when={toolsRefused().length > 0}>
                            <div>
                                <div
                                    style={{
                                        "font-size": "var(--font-size-xsmall)",
                                        color: "var(--muted-foreground)",
                                        "margin-bottom": "0.25rem",
                                    }}
                                >
                                    Tools blocked
                                </div>
                                <div style={{ display: "flex", gap: "0.25rem", "flex-wrap": "wrap" }}>
                                    <For each={toolsRefused()}>
                                        {(toolName) => <Badge variant="destructive">{toolName}</Badge>}
                                    </For>
                                </div>
                            </div>
                        </Show>
                        <div>
                            <div
                                style={{
                                    "font-size": "var(--font-size-xsmall)",
                                    color: "var(--muted-foreground)",
                                    "margin-bottom": "0.25rem",
                                }}
                            >
                                Cost
                            </div>
                            <Savings
                                cost={interaction()!.cost ?? "0"}
                                baselineCost={interaction()!.baselineCost ?? "0"}
                                toonCostSavings={interaction()!.toonCostSavings}
                                toonTokensSaved={
                                    interaction()!.toonTokensBefore && interaction()!.toonTokensAfter
                                        ? interaction()!.toonTokensBefore! - interaction()!.toonTokensAfter!
                                        : undefined
                                }
                                toonSkipReason={interaction()!.toonSkipReason}
                                baselineModel={interaction()!.baselineModel}
                                actualModel={interaction()!.model}
                                variant="interaction"
                            />
                        </div>
                        <div>
                            <div
                                style={{
                                    "font-size": "var(--font-size-xsmall)",
                                    color: "var(--muted-foreground)",
                                    "margin-bottom": "0.25rem",
                                }}
                            >
                                Tokens
                            </div>
                            <div style={{ "font-size": "var(--font-size-small)" }}>
                                {(interaction()!.inputTokens ?? 0).toLocaleString()} in /{" "}
                                {(interaction()!.outputTokens ?? 0).toLocaleString()} out
                            </div>
                        </div>
                        <Show when={(dualLlmResults() ?? []).length > 0}>
                            <div>
                                <div
                                    style={{
                                        "font-size": "var(--font-size-xsmall)",
                                        color: "var(--muted-foreground)",
                                        "margin-bottom": "0.25rem",
                                    }}
                                >
                                    Dual LLM
                                </div>
                                <Badge variant="info">Active ({(dualLlmResults() ?? []).length} checks)</Badge>
                            </div>
                        </Show>
                        <div>
                            <div
                                style={{
                                    "font-size": "var(--font-size-xsmall)",
                                    color: "var(--muted-foreground)",
                                    "margin-bottom": "0.25rem",
                                }}
                            >
                                Timestamp
                            </div>
                            <div style={{ "font-size": "var(--font-size-small)" }}>
                                {formatDate(interaction()!.createdAt)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Conversation */}
                <Show when={uiMessages().length > 0}>
                    <div data-label="Conversation" style={{ "margin-bottom": "1.5rem" }}>
                        <h3 style={{ "font-weight": "bold", "margin-bottom": "1rem" }}>Conversation</h3>
                        <ChatViewer messages={uiMessages()} />
                    </div>
                </Show>

                {/* Raw Data */}
                <div data-label="Raw data" style={{ display: "grid", gap: "1rem" }}>
                    <h3 style={{ "font-weight": "bold" }}>Raw data</h3>
                    <JsonSection title="Raw request (original)" data={interaction()!.request} />
                    <Show when={interaction()!.processedRequest}>
                        <JsonSection title="Processed request (sent to LLM)" data={interaction()!.processedRequest} />
                    </Show>
                    <JsonSection title="Raw response" data={interaction()!.response} />
                </div>
            </Show>
        </>
    );
}
