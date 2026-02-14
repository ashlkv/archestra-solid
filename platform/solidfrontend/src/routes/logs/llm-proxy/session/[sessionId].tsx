import { A, useNavigate, useParams, useSearchParams } from "@solidjs/router";
import { For, type JSX, Show } from "solid-js";
import { ArrowLeft } from "@/components/icons";
import { Pagination } from "@/components/logs/Pagination";
import { Savings } from "@/components/logs/Savings";
import { TruncatedText } from "@/components/logs/TruncatedText";
import { Badge } from "@/components/primitives/Badge";
import { PageHeader } from "@/components/primitives/PageHeader";
import { Spinner } from "@/components/primitives/Spinner";
import { StaticLayout } from "@/components/primitives/StaticLayout";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/primitives/Table";
import { useAgents } from "@/lib/agent.query";
import { useInteractionSessions, useInteractions } from "@/lib/interaction.query";
import { DEFAULT_TABLE_LIMIT, DynamicInteraction, formatDate, formatDuration } from "@/lib/interaction.utils";
import type { Agent, Interaction, SessionData } from "@/types";

function asString(value: string | string[] | undefined): string {
    if (Array.isArray(value)) return value[0] ?? "";
    return value ?? "";
}

export default function SessionDetailPage(): JSX.Element {
    const params = useParams<{ sessionId: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const page = () => Number(asString(searchParams.page) || "0");

    const interactionsParams = () => ({
        sessionId: params.sessionId,
        limit: DEFAULT_TABLE_LIMIT,
        offset: page() * DEFAULT_TABLE_LIMIT,
    });

    const sessionParams = () => ({
        limit: 1,
        offset: 0,
        sessionId: params.sessionId,
    });

    const { data: interactionsData, query: interactionsQuery } = useInteractions(interactionsParams);
    const { data: sessionMeta } = useInteractionSessions(sessionParams);
    const { data: agents } = useAgents();

    const interactions = () => interactionsData()?.data ?? [];
    const total = () => interactionsData()?.total ?? 0;
    const session = () => sessionMeta()?.data?.[0] as SessionData | undefined;

    const getProfileName = (id: string): string => {
        const agentList = agents() ?? [];
        return agentList.find((a: Agent) => a.id === id)?.name ?? id;
    };

    const sessionTitle = () => {
        const s = session();
        if (!s) return "Session";
        return s.claudeCodeTitle || s.conversationTitle || "Session";
    };

    const getInteractionRequestType = (interaction: Interaction): string => {
        return (interaction as any).requestType ?? (interaction as any).externalAgentIdLabel ?? "Main";
    };

    const getInteractionRequestTypeVariant = (interaction: Interaction): "primary" | "muted" => {
        return (interaction as any).requestType === "main" ? "primary" : "muted";
    };

    return (
        <StaticLayout>
            <div style={{ display: "flex", "align-items": "center", gap: "0.5rem", "margin-bottom": "1rem" }}>
                <A href="/logs/llm-proxy" style={{ color: "var(--muted-foreground)" }}>
                    <ArrowLeft style={{ width: "20px", height: "20px" }} />
                </A>
                <PageHeader title={sessionTitle()} />
            </div>

            <Show when={session()}>
                <div
                    data-label="Session summary"
                    style={{
                        border: "1px solid var(--border)",
                        "border-radius": "var(--radius)",
                        padding: "1rem",
                        "margin-bottom": "1.5rem",
                    }}
                >
                    <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem", "margin-bottom": "1rem" }}>
                        <Badge variant="outline">{getProfileName(session()!.profileId)}</Badge>
                        <Show when={session()!.sessionSource === "claude_code"}>
                            <Badge variant="muted">Claude Code</Badge>
                        </Show>
                        <For each={session()!.userNames ?? []}>
                            {(userName) => <Badge variant="ghost">{userName}</Badge>}
                        </For>
                    </div>
                    <div
                        style={{
                            display: "grid",
                            "grid-template-columns": "repeat(auto-fit, minmax(150px, 1fr))",
                            gap: "1rem",
                        }}
                    >
                        <div>
                            <div style={{ "font-size": "var(--font-size-xsmall)", color: "var(--muted-foreground)" }}>
                                Total requests
                            </div>
                            <div style={{ "font-weight": "bold" }}>{session()!.requestCount}</div>
                        </div>
                        <div>
                            <div style={{ "font-size": "var(--font-size-xsmall)", color: "var(--muted-foreground)" }}>
                                Total tokens
                            </div>
                            <div style={{ "font-weight": "bold" }}>
                                {(session()!.totalInputTokens ?? 0).toLocaleString()} in /{" "}
                                {(session()!.totalOutputTokens ?? 0).toLocaleString()} out
                            </div>
                        </div>
                        <div>
                            <div style={{ "font-size": "var(--font-size-xsmall)", color: "var(--muted-foreground)" }}>
                                Cost
                            </div>
                            <div style={{ "font-weight": "bold" }}>
                                <Savings
                                    cost={session()!.totalCost ?? "0"}
                                    baselineCost={session()!.totalBaselineCost ?? "0"}
                                    toonCostSavings={session()!.totalToonCostSavings}
                                    variant="session"
                                />
                            </div>
                        </div>
                        <div>
                            <div style={{ "font-size": "var(--font-size-xsmall)", color: "var(--muted-foreground)" }}>
                                Models
                            </div>
                            <div style={{ display: "flex", gap: "0.25rem", "flex-wrap": "wrap" }}>
                                <For each={session()!.models ?? []}>
                                    {(model) => <Badge variant="muted">{model}</Badge>}
                                </For>
                            </div>
                        </div>
                        <div>
                            <div style={{ "font-size": "var(--font-size-xsmall)", color: "var(--muted-foreground)" }}>
                                Duration
                            </div>
                            <div style={{ "font-weight": "bold" }}>
                                {formatDuration(session()!.firstRequestTime, session()!.lastRequestTime)}
                            </div>
                        </div>
                    </div>
                </div>
            </Show>

            <Show when={interactionsQuery.pending}>
                <div style={{ display: "flex", "justify-content": "center", padding: "3rem" }}>
                    <Spinner />
                </div>
            </Show>

            <Show when={!interactionsQuery.pending && interactions().length > 0}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>Time</TableHeaderCell>
                            <TableHeaderCell>Agent</TableHeaderCell>
                            <TableHeaderCell>Model</TableHeaderCell>
                            <TableHeaderCell>Cost</TableHeaderCell>
                            <TableHeaderCell>User message</TableHeaderCell>
                            <TableHeaderCell>Tools</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
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
                                        onClick={() => navigate(`/logs/${interaction.id}`)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <TableCell>
                                            <span style={{ "font-size": "var(--font-size-small)" }}>
                                                {formatDate(interaction.createdAt)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getInteractionRequestTypeVariant(interaction)}>
                                                {getInteractionRequestType(interaction)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span style={{ "font-size": "var(--font-size-small)" }}>
                                                {dynamicInteraction?.modelName ?? "Unknown"}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Savings
                                                cost={interactionAny.cost ?? "0"}
                                                baselineCost={interactionAny.baselineCost ?? "0"}
                                                toonCostSavings={interactionAny.toonCostSavings}
                                                toonTokensSaved={
                                                    interactionAny.toonTokensBefore && interactionAny.toonTokensAfter
                                                        ? interactionAny.toonTokensBefore -
                                                          interactionAny.toonTokensAfter
                                                        : undefined
                                                }
                                                toonSkipReason={interactionAny.toonSkipReason}
                                                baselineModel={interactionAny.baselineModel}
                                                actualModel={interactionAny.model}
                                                variant="interaction"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TruncatedText
                                                message={dynamicInteraction?.getLastUserMessage()}
                                                maxLength={80}
                                            />
                                        </TableCell>
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
                    </TableBody>
                </Table>

                <Pagination
                    page={page()}
                    pageSize={DEFAULT_TABLE_LIMIT}
                    total={total()}
                    onPageChange={(newPage) => setSearchParams({ page: String(newPage) })}
                />
            </Show>
        </StaticLayout>
    );
}
