import { type JSX, Show } from "solid-js";
import { ChatViewer } from "@/logs/components/chat/ChatViewer";
import { JsonSection } from "@/common/JsonSection";
import { SessionToolsTable } from "@/logs/components/SessionToolsTable";
import { AgentBadge } from "@/primitives/AgentBadge";
import { Badge } from "@/primitives/Badge";
import { CostBadge } from "@/primitives/CostBadge";
import { ProviderModelBadge } from "@/primitives/ProviderModelBadge";
import { Spinner } from "@/primitives/Spinner";
import { VerticalSplit } from "@/primitives/VerticalSplit";
import { TimestampBadge } from "@/primitives/TimestampBadge";
import { TokensBadge } from "@/primitives/TokensBadge";
import { useAgents } from "@/lib/agent.query";
import { useInteraction } from "@/logs/interaction.query";
import { DynamicInteraction } from "@/logs/interaction.utils";
import type { Agent } from "@/types";

export function InteractionDetailContent(props: { interactionId: string; view: "chat" | "raw" }): JSX.Element {
    const { data: interaction, query: interactionQuery } = useInteraction(() => ({
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

    const dualLlmAnalyses = () => (interaction() as any)?.dualLlmAnalyses ?? [];

    const uiMessages = () => {
        const di = dynamicInteraction();
        if (!di) return [];
        return di.mapToUiMessages(dualLlmAnalyses());
    };

    const toolNames = () => dynamicInteraction()?.getToolNamesUsed() ?? [];

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
                    <VerticalSplit columns={[3, 7]}>
                        <div style={{ position: "sticky", top: "0", "align-self": "start" }}>
                            <Show when={toolNames().length > 0}>
                                <SessionToolsTable toolNames={toolNames()} />
                            </Show>
                        </div>
                        <div>
                            <Show when={uiMessages().length > 0}>
                                <ChatViewer messages={uiMessages()} timestamp={interaction()!.createdAt} />
                            </Show>
                        </div>
                    </VerticalSplit>
                </Show>

                <Show when={props.view === "raw"}>
                    <div data-label="Raw data" style={{ display: "grid", gap: "1rem" }}>
                        <Show
                            when={interaction()!.processedRequest}
                            fallback={
                                <JsonSection
                                    title="Raw request (original)"
                                    data={interaction()!.request}
                                    expandable={false}
                                    help={HELP_ORIGINAL_REQUEST}
                                />
                            }
                        >
                            <VerticalSplit columns={[5, 5]}>
                                <JsonSection
                                    title="Raw request (original)"
                                    data={interaction()!.request}
                                    expandable={false}
                                    help={HELP_ORIGINAL_REQUEST}
                                />
                                <JsonSection
                                    title="Processed request (sent to LLM)"
                                    data={interaction()!.processedRequest}
                                    diffOriginal={interaction()!.request}
                                    expandable={false}
                                    help={HELP_PROCESSED_REQUEST}
                                />
                            </VerticalSplit>
                        </Show>
                        <JsonSection title="Raw response" data={interaction()!.response} expandable={false} />
                    </div>
                </Show>
            </Show>
        </>
    );
}

const helpTextStyle = { "font-size": "var(--small-font-size)", "line-height": "var(--small-line-height)" };

const HELP_ORIGINAL_REQUEST = (
    <p style={helpTextStyle}>
        The original request as sent by the client application before any Archestra processing. This is the unmodified
        payload received by the LLM proxy.
    </p>
);

const HELP_PROCESSED_REQUEST = (
    <p style={helpTextStyle}>
        The request after Archestra processing (e.g. tool invocation policies, trusted data policies, system prompt
        injection, or model routing). This is the actual payload sent to the LLM provider. Use the diff toggle to
        compare against the original request.
    </p>
);

export function InteractionHeaderBar(props: { interactionId: string }): JSX.Element {
    const { data: interaction } = useInteraction(() => ({
        interactionId: props.interactionId,
    }));
    const { data: agents } = useAgents();

    const dualLlmAnalyses = () => (interaction() as any)?.dualLlmAnalyses ?? [];

    const dynamicInteraction = () => {
        const i = interaction();
        if (!i) return undefined;
        try {
            return new DynamicInteraction(i);
        } catch {
            return undefined;
        }
    };

    const getProfileName = (profileId: string | null): string => {
        if (!profileId) return "Unknown";
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
                <AgentBadge agentId={interaction()!.profileId}>{getProfileName(interaction()!.profileId)}</AgentBadge>
                <Show when={interaction()!.externalAgentId}>
                    <Badge variant="ghost">
                        {(interaction()! as any).externalAgentIdLabel ?? interaction()!.externalAgentId}
                    </Badge>
                </Show>
                <ProviderModelBadge
                    provider={dynamicInteraction()?.provider ?? "Unknown"}
                    model={dynamicInteraction()?.modelName ?? "Unknown"}
                    size="medium"
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
                <Show when={dualLlmAnalyses().length > 0}>
                    <Badge variant="muted">Dual LLM ({dualLlmAnalyses().length} checks)</Badge>
                </Show>
                <TimestampBadge date={interaction()!.createdAt} />
            </div>
        </Show>
    );
}
