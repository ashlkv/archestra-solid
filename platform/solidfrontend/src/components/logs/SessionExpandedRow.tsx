import { For, type JSX, Show } from "solid-js";
import { Savings } from "@/components/logs/Savings";
import { TruncatedText } from "@/components/logs/TruncatedText";
import { Badge } from "@/components/primitives/Badge";
import { ProviderModelBadge } from "@/components/primitives/ProviderModelBadge";
import { Spinner } from "@/components/primitives/Spinner";
import { TableCell } from "@/components/primitives/Table";
import { useInteractions } from "@/lib/interaction.query";
import { DynamicInteraction, formatDate } from "@/lib/interaction.utils";
import type { Interaction, SessionData } from "@/types";

interface Props {
    session: SessionData;
    activeInteractionId?: string | null;
    onInteractionClick: (interactionId: string) => void;
}

export function SessionExpandedRow(props: Props): JSX.Element {
    const interactionsParams = () => ({
        sessionId: props.session.sessionId!,
        limit: 100,
        offset: 0,
    });

    const { data: interactionsData, query: interactionsQuery } = useInteractions(interactionsParams);

    const interactions = () => interactionsData()?.data ?? [];

    const getInteractionRequestType = (interaction: Interaction): string => {
        return (interaction as any).requestType ?? (interaction as any).externalAgentIdLabel ?? "Main";
    };

    const getInteractionRequestTypeVariant = (interaction: Interaction): "primary" | "muted" => {
        return (interaction as any).requestType === "main" ? "primary" : "muted";
    };

    return (
        <>
            <Show when={interactionsQuery.pending}>
                <tr>
                    <td colSpan={7} style={{ "border-bottom": "1px solid var(--border)" }}>
                        <div style={{ display: "flex", "justify-content": "center", padding: "1rem" }}>
                            <Spinner />
                        </div>
                    </td>
                </tr>
            </Show>

            <Show when={!interactionsQuery.pending}>
                <For each={interactions()}>
                    {(interaction) => {
                        let dynamicInteraction: DynamicInteraction | undefined;
                        try {
                            dynamicInteraction = new DynamicInteraction(interaction);
                        } catch {
                            // Skip unsupported types
                        }

                        const toolNames = dynamicInteraction?.getToolNamesUsed() ?? [];
                        const interactionAny = interaction as any;

                        return (
                            <tr
                                onClick={(e) => {
                                    e.stopPropagation();
                                    props.onInteractionClick(interaction.id);
                                }}
                                style={{
                                    cursor: "pointer",
                                    background:
                                        interaction.id === props.activeInteractionId
                                            ? "color-mix(in srgb, var(--foreground) 10%, transparent)"
                                            : "var(--muted)",
                                }}
                            >
                                <TableCell>
                                    <div
                                        style={{
                                            display: "flex",
                                            "align-items": "center",
                                            gap: "0.5rem",
                                            "padding-left": "2rem",
                                        }}
                                    >
                                        <Badge variant={getInteractionRequestTypeVariant(interaction)}>
                                            {getInteractionRequestType(interaction)}
                                        </Badge>
                                        <TruncatedText
                                            message={dynamicInteraction?.getLastUserMessage()}
                                            maxLength={80}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell />
                                <TableCell>
                                    <ProviderModelBadge
                                        provider={dynamicInteraction?.provider ?? "Unknown"}
                                        model={dynamicInteraction?.modelName ?? "Unknown"}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Savings
                                        cost={interactionAny.cost ?? "0"}
                                        baselineCost={interactionAny.baselineCost ?? "0"}
                                        toonCostSavings={interactionAny.toonCostSavings}
                                        toonTokensSaved={
                                            interactionAny.toonTokensBefore && interactionAny.toonTokensAfter
                                                ? interactionAny.toonTokensBefore - interactionAny.toonTokensAfter
                                                : undefined
                                        }
                                        toonSkipReason={interactionAny.toonSkipReason}
                                        baselineModel={interactionAny.baselineModel}
                                        actualModel={interactionAny.model}
                                        variant="interaction"
                                    />
                                </TableCell>
                                <TableCell>
                                    <span style={{ "font-size": "var(--font-size-small)" }}>
                                        {formatDate(interaction.createdAt)}
                                    </span>
                                </TableCell>
                                <TableCell />
                                <TableCell>
                                    <div style={{ display: "flex", gap: "0.25rem", "flex-wrap": "wrap" }}>
                                        <For each={toolNames.slice(0, 2)}>
                                            {(toolName) => <Badge variant="muted">{toolName}</Badge>}
                                        </For>
                                        <Show when={toolNames.length > 2}>
                                            <Badge variant="muted">+{toolNames.length - 2}</Badge>
                                        </Show>
                                    </div>
                                </TableCell>
                            </tr>
                        );
                    }}
                </For>
            </Show>
        </>
    );
}
