import { type JSX, Show } from "solid-js";
import { ChatViewer } from "@/components/logs/chat/ChatViewer";
import { JsonSection } from "@/components/logs/JsonSection";
import { Badge } from "@/components/primitives/Badge";
import { CostBadge } from "@/components/primitives/CostBadge";
import { ProviderModelBadge } from "@/components/primitives/ProviderModelBadge";
import { Spinner } from "@/components/primitives/Spinner";
import { Split } from "@/components/primitives/Split";
import { TimestampBadge } from "@/components/primitives/TimestampBadge";
import { TokensBadge } from "@/components/primitives/TokensBadge";
import { useAgents } from "@/lib/agent.query";
import { useDualLlmResultsByInteraction } from "@/lib/dual-llm-result.query";
import { useInteraction } from "@/lib/interaction.query";
import { DynamicInteraction } from "@/lib/interaction.utils";
import type { Agent } from "@/types";

export function InteractionDetailContent(props: { interactionId: string; view: "chat" | "raw" }): JSX.Element {
    const { data: interaction, query: interactionQuery } = useInteraction(() => ({
        interactionId: props.interactionId,
    }));
    const { data: dualLlmResults } = useDualLlmResultsByInteraction(() => ({
        interactionId: props.interactionId,
    }));

    const dynamicInteraction = () => {
        const i = interaction();
        if (!i) return undefined;
        try {
            return new DynamicInteraction(i);
        } catch {
            return undefined;
        }
    };

    const uiMessages = () => {
        const di = dynamicInteraction();
        if (!di) return [];
        return di.mapToUiMessages(dualLlmResults() ?? []);
    };

    return (
        <>
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
                <Show when={props.view === "chat"}>
                    <Split columns={[3, 7]}>
                        <div data-label="Tools">{/* Tools will go here */}</div>
                        <div>
                            <Show when={uiMessages().length > 0}>
                                <ChatViewer messages={uiMessages()} />
                            </Show>
                        </div>
                    </Split>
                </Show>

                <Show when={props.view === "raw"}>
                    <div data-label="Raw data" style={{ display: "grid", gap: "1rem" }}>
                        <JsonSection title="Raw request (original)" data={interaction()!.request} defaultOpen />
                        <Show when={interaction()!.processedRequest}>
                            <JsonSection
                                title="Processed request (sent to LLM)"
                                data={interaction()!.processedRequest}
                                defaultOpen
                            />
                        </Show>
                        <JsonSection title="Raw response" data={interaction()!.response} defaultOpen />
                    </div>
                </Show>
            </Show>
        </>
    );
}

export function InteractionHeaderBar(props: { interactionId: string }): JSX.Element {
    const { data: interaction } = useInteraction(() => ({
        interactionId: props.interactionId,
    }));
    const { data: dualLlmResults } = useDualLlmResultsByInteraction(() => ({
        interactionId: props.interactionId,
    }));
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

    return (
        <Show when={interaction()}>
            <div
                data-label="Metadata"
                style={{
                    display: "flex",
                    "flex-wrap": "wrap",
                    gap: "0.5rem",
                    "align-items": "center",
                }}
            >
                <Badge variant="outline">{getProfileName(interaction()!.profileId)}</Badge>
                <Show when={interaction()!.externalAgentId}>
                    <Badge variant="ghost">
                        {(interaction()! as any).externalAgentIdLabel ?? interaction()!.externalAgentId}
                    </Badge>
                </Show>
                <ProviderModelBadge
                    provider={dynamicInteraction()?.provider ?? "Unknown"}
                    model={dynamicInteraction()?.modelName ?? "Unknown"}
                />
                <TokensBadge
                    inputTokens={interaction()!.inputTokens ?? 0}
                    outputTokens={interaction()!.outputTokens ?? 0}
                    toonTokensBefore={interaction()!.toonTokensBefore}
                    toonTokensAfter={interaction()!.toonTokensAfter}
                />
                <CostBadge
                    cost={interaction()!.cost ?? "0"}
                    baselineCost={interaction()!.baselineCost ?? "0"}
                    toonCostSavings={interaction()!.toonCostSavings}
                    toonTokensBefore={interaction()!.toonTokensBefore}
                    toonTokensAfter={interaction()!.toonTokensAfter}
                    toonSkipReason={interaction()!.toonSkipReason}
                    baselineModel={interaction()!.baselineModel}
                    actualModel={interaction()!.model}
                    variant="interaction"
                />
                <Show when={(dualLlmResults() ?? []).length > 0}>
                    <Badge variant="muted">Dual LLM ({(dualLlmResults() ?? []).length} checks)</Badge>
                </Show>
                <TimestampBadge date={interaction()!.createdAt} />
            </div>
        </Show>
    );
}
