import { A, useNavigate, useSearchParams } from "@solidjs/router";
import { For, type JSX, Show } from "solid-js";
import { Layers, X } from "@/components/icons";
import { DateTimeRangePicker } from "@/components/logs/DateTimeRangePicker";
import { DebouncedInput } from "@/components/logs/DebouncedInput";
import { Pagination } from "@/components/logs/Pagination";
import { Savings } from "@/components/logs/Savings";
import { SearchableSelect } from "@/components/logs/SearchableSelect";
import { TruncatedText } from "@/components/logs/TruncatedText";
import { AgentBadge } from "@/components/primitives/AgentBadge";
import { Badge } from "@/components/primitives/Badge";
import { ModelBadge } from "@/components/primitives/ModelBadge";
import { Button } from "@/components/primitives/Button";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/primitives/Empty";
import { PageHeader } from "@/components/primitives/PageHeader";
import { Spinner } from "@/components/primitives/Spinner";
import { StaticLayout } from "@/components/primitives/StaticLayout";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/primitives/Table";
import { Tab, TabList, Tabs } from "@/components/primitives/Tabs";
import { Tooltip } from "@/components/primitives/Tooltip";
import { useAgents } from "@/lib/agent.query";
import { useInteractionSessions, useUniqueUserIds } from "@/lib/interaction.query";
import { DEFAULT_TABLE_LIMIT, DynamicInteraction, formatDate, formatDuration } from "@/lib/interaction.utils";
import type { Agent, SessionData } from "@/types";
import { Main } from "~/components/primitives/Main";

function asString(value: string | string[] | undefined): string {
    if (Array.isArray(value)) return value[0] ?? "";
    return value ?? "";
}

export default function LlmProxyLogsPage(): JSX.Element {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const page = () => Number(asString(searchParams.page) || "0");
    const pageSize = () => Number(asString(searchParams.pageSize) || String(DEFAULT_TABLE_LIMIT));
    const profileId = () => asString(searchParams.profileId);
    const userId = () => asString(searchParams.userId);
    const search = () => asString(searchParams.search);
    const startDate = () => asString(searchParams.startDate);
    const endDate = () => asString(searchParams.endDate);

    const queryParams = () => ({
        limit: pageSize(),
        offset: page() * pageSize(),
        profileId: profileId() || undefined,
        userId: userId() || undefined,
        search: search() || undefined,
        startDate: startDate() || undefined,
        endDate: endDate() || undefined,
    });

    const { data: sessionsData, query: sessionsQuery } = useInteractionSessions(queryParams);
    const { data: agents } = useAgents();
    const { data: userIds } = useUniqueUserIds();

    const sessions = () => sessionsData()?.data ?? [];
    const total = () => sessionsData()?.total ?? 0;

    const hasFilters = () => profileId() || userId() || search() || startDate();

    const profileItems = () => {
        const agentList = agents() ?? [];
        return [
            { value: "", label: "All profiles" },
            ...agentList.map((agent: Agent) => ({ value: agent.id, label: agent.name })),
        ];
    };

    const userIdItems = () => {
        const ids = userIds() ?? [];
        return [
            { value: "", label: "All users" },
            ...ids.map((agent: Agent) => ({ value: agent.id, label: agent.name })),
        ];
    };

    const clearFilters = () => {
        setSearchParams({
            page: undefined,
            profileId: undefined,
            userId: undefined,
            search: undefined,
            startDate: undefined,
            endDate: undefined,
        });
    };

    const getSessionTitle = (session: SessionData): string => {
        if (session.claudeCodeTitle) return session.claudeCodeTitle;
        if (session.conversationTitle) return session.conversationTitle;
        if (session.lastInteractionRequest) {
            try {
                const interaction = {
                    request: session.lastInteractionRequest,
                    response: {},
                    type: session.lastInteractionType,
                    id: "",
                    profileId: "",
                    externalAgentId: null,
                    model: null,
                    baselineModel: null,
                    cost: "0",
                    baselineCost: "0",
                    toonCostSavings: null,
                    toonSkipReason: null,
                    toonTokensBefore: null,
                    toonTokensAfter: null,
                    inputTokens: null,
                    outputTokens: null,
                    createdAt: "",
                    requestType: null,
                    processedRequest: null,
                    externalAgentIdLabel: null,
                    sessionId: null,
                };
                const dynamic = new DynamicInteraction(interaction as any);
                return dynamic.getLastUserMessage() || "Untitled session";
            } catch {
                return "Untitled session";
            }
        }
        return "Untitled session";
    };

    const getProfileName = (id: string): string => {
        const agentList = agents() ?? [];
        const agent = agentList.find((a: Agent) => a.id === id);
        return agent?.name ?? id;
    };

    const onRowClick = (session: SessionData) => {
        if (session.sessionId) {
            navigate(`/logs/llm-proxy/session/${session.sessionId}`);
        } else {
            navigate(`/logs/${session.interactionId}`);
        }
    };

    return (
        <StaticLayout>
            <PageHeader
                title="Logs"
                description="View all logs including LLM proxy interactions and MCP gateway tool calls."
            />
            <Main>
                {/*<Tabs defaultValue="llm-proxy">
                    <TabList>
                        <Tab value="llm-proxy">
                            <A href="/logs/llm-proxy" style={{ "text-decoration": "none", color: "inherit" }}>
                                LLM Proxy
                            </A>
                        </Tab>
                        <Tab value="mcp-gateway">
                            <A href="/logs/mcp-gateway" style={{ "text-decoration": "none", color: "inherit" }}>
                                MCP Gateway
                            </A>
                        </Tab>
                    </TabList>
                </Tabs>*/}

                {/*<div
                    data-label="Filters"
                    style={{
                        display: "flex",
                        "flex-wrap": "wrap",
                        gap: "0.5rem",
                        "align-items": "center",
                        "margin-top": "1rem",
                    }}
                >
                    <DebouncedInput
                        value={search()}
                        onChange={(value) => setSearchParams({ search: value || undefined, page: "0" })}
                        placeholder="Search sessions..."
                    />
                    <SearchableSelect
                        value={profileId()}
                        onValueChange={(value) => setSearchParams({ profileId: value || undefined, page: "0" })}
                        items={profileItems()}
                        placeholder="All profiles"
                    />
                    <SearchableSelect
                        value={userId()}
                        onValueChange={(value) => setSearchParams({ userId: value || undefined, page: "0" })}
                        items={userIdItems()}
                        placeholder="All users"
                    />
                    <DateTimeRangePicker
                        startDate={startDate()}
                        endDate={endDate()}
                        onApply={(start, end) => setSearchParams({ startDate: start, endDate: end, page: "0" })}
                        onClear={() => setSearchParams({ startDate: undefined, endDate: undefined, page: "0" })}
                    />
                    <Show when={hasFilters()}>
                        <Button variant="ghost" size="small" onClick={clearFilters}>
                            <X style={{ width: "14px", height: "14px" }} /> Clear filters
                        </Button>
                    </Show>
                </div>*/}

                <Show when={sessionsQuery.pending}>
                    <div style={{ display: "flex", "justify-content": "center", padding: "3rem" }}>
                        <Spinner />
                    </div>
                </Show>

                <Show when={!sessionsQuery.pending && sessionsQuery.error}>
                    <div style={{ color: "var(--destructive)", padding: "1rem" }}>
                        Failed to load sessions: {sessionsQuery.error?.message}
                    </div>
                </Show>

                <Show when={!sessionsQuery.pending && !sessionsQuery.error && sessions().length === 0}>
                    <Empty>
                        <EmptyTitle>No sessions found</EmptyTitle>
                        <EmptyDescription>
                            {hasFilters() ? "Try adjusting your filters." : "No LLM proxy sessions recorded yet."}
                        </EmptyDescription>
                    </Empty>
                </Show>

                <Show when={!sessionsQuery.pending && !sessionsQuery.error && sessions().length > 0}>
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
                        <TableBody>
                            <For each={sessions()}>
                                {(session) => (
                                    <tr onClick={() => onRowClick(session)} style={{ cursor: "pointer" }}>
                                        <TableCell data-label="Session">
                                            <div
                                                style={{
                                                    display: "flex",
                                                    "align-items": "center",
                                                    gap: "0.5rem",
                                                }}
                                            >
                                                <Show when={session.requestCount > 1}>
                                                    <Layers
                                                        style={{
                                                            width: "14px",
                                                            height: "14px",
                                                            "flex-shrink": 0,
                                                            color: "var(--muted-foreground)",
                                                        }}
                                                    />
                                                </Show>
                                                <TruncatedText message={getSessionTitle(session)} maxLength={80} />
                                                <AgentBadge source={session.sessionSource} />
                                            </div>
                                        </TableCell>
                                        <TableCell data-label="Requests">{session.requestCount}</TableCell>
                                        <TableCell data-label="Models">
                                            <div style={{ display: "flex", gap: "0.25rem", "flex-wrap": "wrap" }}>
                                                <For each={session.models?.slice(0, 2) ?? []}>
                                                    {(model) => <ModelBadge model={model} />}
                                                </For>
                                                <Show when={(session.models?.length ?? 0) > 2}>
                                                    <Tooltip content={(session.models ?? []).join(", ")}>
                                                        <Badge variant="muted">
                                                            +{(session.models?.length ?? 0) - 2}
                                                        </Badge>
                                                    </Tooltip>
                                                </Show>
                                            </div>
                                        </TableCell>
                                        <TableCell data-label="Cost">
                                            <Savings
                                                cost={session.totalCost ?? "0"}
                                                baselineCost={session.totalBaselineCost ?? "0"}
                                                toonCostSavings={session.totalToonCostSavings}
                                                variant="session"
                                            />
                                        </TableCell>
                                        <TableCell data-label="Date">
                                            {formatDate(session.lastRequestTime)}
                                        </TableCell>
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
                                            <div style={{ display: "flex", gap: "0.25rem", "flex-wrap": "wrap" }}>
                                                <Badge variant="outline">{getProfileName(session.profileId)}</Badge>
                                                <For each={session.userNames?.slice(0, 2) ?? []}>
                                                    {(userName) => <Badge variant="ghost">{userName}</Badge>}
                                                </For>
                                            </div>
                                        </TableCell>
                                    </tr>
                                )}
                            </For>
                        </TableBody>
                    </Table>

                    <Pagination
                        page={page()}
                        pageSize={pageSize()}
                        total={total()}
                        onPageChange={(newPage) => setSearchParams({ page: String(newPage) })}
                    />
                </Show>
            </Main>
        </StaticLayout>
    );
}
