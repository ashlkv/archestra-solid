import { createEffect, For, type JSX, onMount, Show, Suspense } from "solid-js";
import { Savings } from "@/components/logs/Savings";
import { TruncatedText } from "@/components/logs/TruncatedText";
import { Badge } from "@/components/primitives/Badge";
import { ProviderModelBadge } from "@/components/primitives/ProviderModelBadge";
import { Table, TableBody, TableCell, TableRow } from "@/components/primitives/Table";
import { useInteractions } from "@/lib/interaction.query";
import { DynamicInteraction, formatDate } from "@/lib/interaction.utils";
import type { Interaction, SessionData } from "@/types";

interface Props {
    session: SessionData;
    activeInteractionId?: string | null;
    onInteractionClick: (interactionId: string) => void;
    onPendingChange?: (pending: boolean) => void;
}

/**
 * Renders as a single <tr> with a colspan wrapper.
 * The <tr> is always in the DOM immediately so animations can target it.
 * Data fetching suspends inside a local <Suspense> boundary.
 */
export function SessionExpandedRow(props: Props): JSX.Element {
    return (
        <tr>
            <td colSpan={7} style={{ padding: 0, border: "none" }}>
                <div style={{ overflow: "hidden" }}>
                    <Suspense fallback={<SkeletonRows count={props.session.requestCount} />}>
                        <SessionExpandedContent
                            session={props.session}
                            activeInteractionId={props.activeInteractionId}
                            onInteractionClick={props.onInteractionClick}
                            onPendingChange={props.onPendingChange}
                        />
                    </Suspense>
                </div>
            </td>
        </tr>
    );
}

/**
 * Inner component that fetches interactions.
 * Isolated so the suspending createAsync doesn't prevent the parent <tr> from rendering.
 */
function SessionExpandedContent(props: Props): JSX.Element {
    const interactionsParams = () => ({
        sessionId: props.session.sessionId!,
        limit: 100,
        offset: 0,
    });

    const { data: interactionsData, query: interactionsQuery } = useInteractions(interactionsParams);
    const interactions = () => interactionsData()?.data ?? [];

    createEffect(() => {
        props.onPendingChange?.(interactionsQuery.pending);
    });

    return (
        <Show when={!interactionsQuery.pending}>
            <Table style={{ "margin-left": "2rem" }}>
                <TableBody>
                    <For each={interactions()}>
                        {(interaction) => (
                            <LogRow
                                interaction={interaction}
                                active={interaction.id === props.activeInteractionId}
                                onClick={() => props.onInteractionClick(interaction.id)}
                            />
                        )}
                    </For>
                </TableBody>
            </Table>
        </Show>
    );
}

function SkeletonBar(props: { width?: string }): JSX.Element {
    let ref!: HTMLDivElement;

    onMount(() => {
        ref.animate([{ opacity: 1 }, { opacity: 0.4 }, { opacity: 1 }], {
            duration: 1500,
            iterations: Number.POSITIVE_INFINITY,
            easing: "ease-in-out",
        });
    });

    return (
        <div
            ref={ref}
            style={{
                width: props.width ?? "100%",
                height: "14px",
                "border-radius": "4px",
                "background-color": "var(--border)",
            }}
        />
    );
}

function SkeletonRows(props: { count: number }): JSX.Element {
    return (
        <Table>
            <TableBody>
                <For each={Array.from({ length: props.count })}>
                    {() => (
                        <TableRow>
                            <TableCell style={{ "padding-left": "2rem" }}>
                                <SkeletonBar />
                            </TableCell>
                            <TableCell />
                            <TableCell>
                                <SkeletonBar width="100px" />
                            </TableCell>
                            <TableCell>
                                <SkeletonBar width="60px" />
                            </TableCell>
                            <TableCell>
                                <SkeletonBar width="80px" />
                            </TableCell>
                            <TableCell />
                            <TableCell>
                                <SkeletonBar width="70px" />
                            </TableCell>
                        </TableRow>
                    )}
                </For>
            </TableBody>
        </Table>
    );
}

export interface LogRowProps {
    interaction: Interaction;
    active: boolean;
    onClick: () => void;
}

export function LogRow(props: LogRowProps): JSX.Element {
    let dynamicInteraction: DynamicInteraction | undefined;
    try {
        dynamicInteraction = new DynamicInteraction(props.interaction);
    } catch {
        // Skip unsupported types
    }

    const toolNames = dynamicInteraction?.getToolNamesUsed() ?? [];
    const interactionAny = props.interaction as any;

    return (
        <TableRow
            onClick={(e) => {
                e.stopPropagation();
                props.onClick();
            }}
            current={props.active}
        >
            <TableCell>
                <Badge variant={getRequestTypeVariant(props.interaction)}>{getRequestType(props.interaction)}</Badge>
                <TruncatedText message={dynamicInteraction?.getLastUserMessage()} maxLength={80} showTooltip={false} />
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
                <span style={{ "font-size": "var(--small-font-size)" }}>{formatDate(props.interaction.createdAt)}</span>
            </TableCell>
            <TableCell />
            <TableCell style={{ "flex-wrap": "wrap" }}>
                <For each={toolNames.slice(0, 2)}>{(toolName) => <Badge variant="muted">{toolName}</Badge>}</For>
                <Show when={toolNames.length > 2}>
                    <Badge variant="muted">+{toolNames.length - 2}</Badge>
                </Show>
            </TableCell>
        </TableRow>
    );
}

function getRequestType(interaction: Interaction): string {
    return (interaction as any).requestType ?? (interaction as any).externalAgentIdLabel ?? "Main";
}

function getRequestTypeVariant(interaction: Interaction): "primary" | "muted" {
    return (interaction as any).requestType === "main" ? "primary" : "muted";
}
