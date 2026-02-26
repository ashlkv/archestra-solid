import { useLocation } from "@solidjs/router";
import { createEffect, createSignal, For, type JSX, Show } from "solid-js";
import { Savings } from "@/components/logs/Savings";
import { LogRow, SessionExpandedRow } from "@/components/logs/SessionExpandedRow";
import { TruncatedText } from "@/components/logs/TruncatedText";
import { AgentBadge } from "@/components/primitives/AgentBadge";
import { Badge } from "@/components/primitives/Badge";
import { ExpandCollapseButton } from "@/components/primitives/ExpandCollapseButton";
import { ExpandCollapseTransition } from "@/components/primitives/ExpandCollapseTransition";
import { ModelBadge } from "@/components/primitives/ModelBadge";
import { SessionSourceBadge } from "@/components/primitives/SessionSourceBadge";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/primitives/Table";
import { Tooltip } from "@/components/primitives/Tooltip";
import { DynamicInteraction, formatDate, formatDuration } from "@/lib/interaction.utils";
import type { Agent, Interaction, SessionData } from "@/types";

const LLM_PROXY_BASE = "/logs/llm-proxy";

interface SessionsTableProps {
    sessions: SessionData[];
    agents: Agent[];
    activeInteractionId?: string | null;
    onInteractionSelect: (interactionId: string) => void;
}

export function SessionsTable(props: SessionsTableProps): JSX.Element {
    const initialIds = parseInitialRouteIds();

    const [expandedSessionId, setExpandedSessionId] = createSignal<string | undefined>(initialIds.sessionId, {
        name: "expandedSession",
    });

    // Collapse when the router navigates to the base path (e.g. sidebar click).
    // replaceState changes don't trigger this since the router is unaware of them.
    const location = useLocation();
    createEffect(() => {
        if (location.pathname === LLM_PROXY_BASE || location.pathname === `${LLM_PROXY_BASE}/`) {
            setExpandedSessionId(undefined);
        }
    });
    const [pendingSessionIds, setPendingSessionIds] = createSignal<Set<string>>(new Set());

    const toggleSession = (nextId: string) => {
        setExpandedSessionId((previousId) => {
            if (nextId !== previousId) {
                replaceUrl(`${LLM_PROXY_BASE}/session/${nextId}`);
                return nextId;
            } else {
                replaceUrl(LLM_PROXY_BASE);
                return undefined;
            }
        });
    };

    const getProfileName = (id: string): string => {
        const agent = props.agents.find((a) => a.id === id);
        return agent?.name ?? id;
    };

    const onRowClick = (session: SessionData) => {
        if (session.sessionId && session.requestCount > 1) {
            toggleSession(session.sessionId);
        } else if (session.interactionId) {
            props.onInteractionSelect(session.interactionId);
        }
    };

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableHeaderCell data-label="Session">Session</TableHeaderCell>
                    <TableHeaderCell data-label="Requests">Requests</TableHeaderCell>
                    <TableHeaderCell data-label="Models">Models</TableHeaderCell>
                    <TableHeaderCell data-label="Cost">Cost</TableHeaderCell>
                    <TableHeaderCell data-label="Last message at">Last message at</TableHeaderCell>
                    <TableHeaderCell data-label="Duration">Duration</TableHeaderCell>
                    <TableHeaderCell data-label="Details">Details</TableHeaderCell>
                </TableRow>
            </TableHead>
            <For each={props.sessions}>
                {(session) => {
                    const isSession = () => !!(session.sessionId && session.requestCount > 1);
                    const isExpanded = () => session.sessionId === expandedSessionId();

                    return (
                        <TableBody>
                            <Show
                                when={isSession()}
                                fallback={
                                    <LogRow
                                        interaction={sessionToInteraction(session)}
                                        active={session.interactionId === props.activeInteractionId}
                                        onClick={() =>
                                            session.interactionId && props.onInteractionSelect(session.interactionId)
                                        }
                                    />
                                }
                            >
                                <TableRow onClick={() => onRowClick(session)} current={isExpanded()}>
                                    <TableCell data-label="Session">
                                        <ExpandCollapseButton
                                            expanded={isExpanded()}
                                            pending={isExpanded() && pendingSessionIds().has(session.sessionId!)}
                                            onClick={() => toggleSession(session.sessionId!)}
                                            size={14}
                                        />
                                        <TruncatedText
                                            message={getSessionTitle(session)}
                                            maxLength={80}
                                            showTooltip={false}
                                        />
                                        <SessionSourceBadge source={session.sessionSource} />
                                    </TableCell>
                                    <TableCell data-label="Requests">{session.requestCount}</TableCell>
                                    <TableCell data-label="Models">
                                        <For each={session.models?.slice(0, 2) ?? []}>
                                            {(model) => <ModelBadge model={model} />}
                                        </For>
                                        <Show when={(session.models?.length ?? 0) > 2}>
                                            <Tooltip content={(session.models ?? []).join(", ")}>
                                                <Badge variant="muted">+{(session.models?.length ?? 0) - 2}</Badge>
                                            </Tooltip>
                                        </Show>
                                    </TableCell>
                                    <TableCell data-label="Cost">
                                        <Savings
                                            cost={session.totalCost ?? "0"}
                                            baselineCost={session.totalBaselineCost ?? "0"}
                                            toonCostSavings={session.totalToonCostSavings}
                                            variant="session"
                                        />
                                    </TableCell>
                                    <TableCell data-label="Date">{formatDate(session.lastRequestTime)}</TableCell>
                                    <TableCell data-label="Duration">
                                        <Show
                                            when={
                                                session.requestCount > 1 &&
                                                session.firstRequestTime !== session.lastRequestTime
                                            }
                                        >
                                            {formatDuration(session.firstRequestTime, session.lastRequestTime)}
                                        </Show>
                                    </TableCell>
                                    <TableCell data-label="Details">
                                        <AgentBadge agentId={session.profileId}>
                                            {getProfileName(session.profileId)}
                                        </AgentBadge>
                                        <For each={session.userNames?.slice(0, 2) ?? []}>
                                            {(userName) => <Badge variant="ghost">{userName}</Badge>}
                                        </For>
                                    </TableCell>
                                </TableRow>
                                <ExpandCollapseTransition
                                    when={!!(isExpanded() && session.sessionId)}
                                    wrapperSelector=":scope > td > div"
                                >
                                    <SessionExpandedRow
                                        session={session}
                                        activeInteractionId={props.activeInteractionId}
                                        onInteractionClick={(id: string) => props.onInteractionSelect(id)}
                                        onPendingChange={(pending: boolean) => {
                                            const id = session.sessionId;
                                            if (!id) return;
                                            setPendingSessionIds((prev) => {
                                                const next = new Set(prev);
                                                if (pending) next.add(id);
                                                else next.delete(id);
                                                return next;
                                            });
                                        }}
                                    />
                                </ExpandCollapseTransition>
                            </Show>
                        </TableBody>
                    );
                }}
            </For>
        </Table>
    );
}

/**
 * Update the URL cosmetically without triggering a SolidStart route transition.
 */
function replaceUrl(path: string): void {
    const searchParams = window.location.search;
    window.history.replaceState(null, "", `${path}${searchParams}`);
}

/**
 * Parse sessionId and entryId from the initial URL on mount.
 */
function parseInitialRouteIds(): { sessionId: string | undefined; entryId: string | undefined } {
    if (typeof window === "undefined") return { sessionId: undefined, entryId: undefined };
    const pathname = window.location.pathname;
    const sessionMatch = pathname.match(/\/logs\/llm-proxy\/session\/([^/]+)/);
    const entryMatch = pathname.match(/\/logs\/llm-proxy(?:\/session\/[^/]+)?\/entry\/([^/]+)/);
    return { sessionId: sessionMatch?.[1], entryId: entryMatch?.[1] };
}

function getSessionTitle(session: SessionData): string {
    if (session.claudeCodeTitle) return session.claudeCodeTitle;
    if (session.conversationTitle) return session.conversationTitle;
    if (session.lastInteractionRequest) {
        try {
            const dynamic = new DynamicInteraction(sessionToInteraction(session));
            return dynamic.getLastUserMessage() || "Untitled session";
        } catch {
            return "Untitled session";
        }
    }
    return "Untitled session";
}

/** Build a minimal Interaction from a standalone SessionData entry. */
function sessionToInteraction(session: SessionData): Interaction {
    return {
        id: session.interactionId ?? "",
        profileId: session.profileId,
        externalAgentId: null,
        executionId: null,
        userId: null,
        sessionId: session.sessionId,
        sessionSource: session.sessionSource,
        request: session.lastInteractionRequest,
        processedRequest: null,
        response: {},
        type: session.lastInteractionType ?? "openai:chatCompletions",
        model: session.models?.[0] ?? null,
        baselineModel: null,
        inputTokens: session.totalInputTokens ?? null,
        outputTokens: session.totalOutputTokens ?? null,
        cost: session.totalCost ?? "0",
        baselineCost: session.totalBaselineCost ?? "0",
        toonCostSavings: session.totalToonCostSavings ?? null,
        toonTokensBefore: null,
        toonTokensAfter: null,
        toonSkipReason: null,
        createdAt: session.lastRequestTime,
        requestType: undefined,
        externalAgentIdLabel: session.externalAgentIdLabels?.[0] ?? null,
    } as Interaction;
}
