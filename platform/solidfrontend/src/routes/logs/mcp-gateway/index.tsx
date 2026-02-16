import { A, useNavigate, useSearchParams } from "@solidjs/router";
import { For, type JSX, Show } from "solid-js";
import { ChevronDown, ChevronUp, X } from "@/components/icons";
import { DateTimeRangePicker } from "@/components/logs/DateTimeRangePicker";
import { McpToolCallDrawer } from "@/components/logs/McpToolCallDrawer";
import { Pagination } from "@/components/logs/Pagination";
import { SearchableSelect } from "@/components/logs/SearchableSelect";
import { TruncatedText } from "@/components/logs/TruncatedText";
import { AgentBadge } from "@/components/primitives/AgentBadge";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/primitives/Empty";
import { PageHeader } from "@/components/primitives/PageHeader";
import { SearchInput } from "@/components/primitives/SearchInput";
import { Spinner } from "@/components/primitives/Spinner";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/primitives/Table";
import { Tab, TabList, Tabs } from "@/components/primitives/Tabs";
import { useAgents } from "@/lib/agent.query";
import { DEFAULT_TABLE_LIMIT, formatDate } from "@/lib/interaction.utils";
import { useMcpToolCalls } from "@/lib/mcp-tool-call.query";
import type { Agent, McpToolCallData } from "@/types";

type ToolResult = { isError?: boolean };

export default function McpGatewayLogsPage(): JSX.Element {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const page = () => Number(searchParams.page ?? 0);
    const pageSize = () => Number(searchParams.pageSize ?? DEFAULT_TABLE_LIMIT);
    const agentId = () => String(searchParams.profileId ?? "");
    const search = () => String(searchParams.search ?? "");
    const startDate = () => String(searchParams.startDate ?? "");
    const endDate = () => String(searchParams.endDate ?? "");
    const sortBy = () => String(searchParams.sortBy ?? "createdAt");
    const sortDirection = () => String(searchParams.sortDirection ?? "desc");

    const queryParams = () => ({
        limit: pageSize(),
        offset: page() * pageSize(),
        agentId: agentId() || undefined,
        search: search() || undefined,
        startDate: startDate() || undefined,
        endDate: endDate() || undefined,
        sortBy: sortBy(),
        sortDirection: sortDirection(),
    });

    const drawerToolCallId = () => String(searchParams.logId ?? "") || null;
    const drawerOpen = () => drawerToolCallId() !== null;

    const { data: toolCallsData, query: toolCallsQuery } = useMcpToolCalls(queryParams);
    const { data: agents } = useAgents();

    const toolCalls = () => toolCallsData()?.data ?? [];
    const total = () => toolCallsData()?.total ?? 0;

    const hasFilters = () => agentId() || search() || startDate();

    const profileItems = () => {
        const agentList = agents() ?? [];
        return [
            { value: "", label: "All MCP Gateways" },
            ...agentList.map((agent: Agent) => ({ value: agent.id, label: agent.name })),
        ];
    };

    const clearFilters = () => {
        setSearchParams({
            page: undefined,
            profileId: undefined,
            search: undefined,
            startDate: undefined,
            endDate: undefined,
        });
    };

    const getProfileName = (agentId: string): string => {
        const agentList = agents() ?? [];
        return agentList.find((a: Agent) => a.id === agentId)?.name ?? agentId;
    };

    const toggleSort = (column: string) => {
        if (sortBy() === column) {
            setSearchParams({ sortDirection: sortDirection() === "desc" ? "asc" : "desc", page: "0" });
        } else {
            setSearchParams({ sortBy: column, sortDirection: "desc", page: "0" });
        }
    };

    const methodBadgeVariant = (method: string) => {
        if (method === "tools/call") return "primary" as const;
        if (method === "tools/list") return "info" as const;
        return "muted" as const;
    };

    const getArguments = (toolCall: McpToolCallData): string => {
        try {
            return JSON.stringify(toolCall.toolCall?.arguments ?? {});
        } catch {
            return "";
        }
    };

    return (
        <>
            <PageHeader
                title="Logs"
                description="View all logs including LLM proxy interactions and MCP gateway tool calls."
            />

            <Tabs defaultValue="mcp-gateway">
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
            </Tabs>

            <div
                data-label="Filters"
                style={{
                    display: "flex",
                    "flex-wrap": "wrap",
                    gap: "0.5rem",
                    "align-items": "center",
                    "margin-top": "1rem",
                }}
            >
                <SearchInput
                    value={search()}
                    onChange={(value) => setSearchParams({ search: value || undefined, page: "0" })}
                    placeholder="Search tool calls..."
                />
                <SearchableSelect
                    value={agentId()}
                    onValueChange={(value) => setSearchParams({ profileId: value || undefined, page: "0" })}
                    items={profileItems()}
                    placeholder="All MCP Gateways"
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
            </div>

            <Show when={toolCallsQuery.pending}>
                <div style={{ display: "flex", "justify-content": "center", padding: "3rem" }}>
                    <Spinner />
                </div>
            </Show>

            <Show when={!toolCallsQuery.pending && toolCallsQuery.error}>
                <div style={{ color: "var(--destructive)", padding: "1rem" }}>
                    Failed to load tool calls: {toolCallsQuery.error?.message}
                </div>
            </Show>

            <Show when={!toolCallsQuery.pending && !toolCallsQuery.error && toolCalls().length === 0}>
                <Empty>
                    <EmptyTitle>No tool calls found</EmptyTitle>
                    <EmptyDescription>
                        {hasFilters() ? "Try adjusting your filters." : "No MCP gateway tool calls recorded yet."}
                    </EmptyDescription>
                </Empty>
            </Show>

            <Show when={!toolCallsQuery.pending && !toolCallsQuery.error && toolCalls().length > 0}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell>
                                <button
                                    type="button"
                                    onClick={() => toggleSort("createdAt")}
                                    style={{
                                        display: "flex",
                                        "align-items": "center",
                                        gap: "0.25rem",
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                        color: "inherit",
                                        "font-weight": "bold",
                                        "font-size": "inherit",
                                        padding: 0,
                                    }}
                                >
                                    Date
                                    <Show when={sortBy() === "createdAt" && sortDirection() === "desc"}>
                                        <ChevronDown style={{ width: "14px", height: "14px" }} />
                                    </Show>
                                    <Show when={sortBy() === "createdAt" && sortDirection() === "asc"}>
                                        <ChevronUp style={{ width: "14px", height: "14px" }} />
                                    </Show>
                                </button>
                            </TableHeaderCell>
                            <TableHeaderCell>
                                <button
                                    type="button"
                                    onClick={() => toggleSort("method")}
                                    style={{
                                        display: "flex",
                                        "align-items": "center",
                                        gap: "0.25rem",
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                        color: "inherit",
                                        "font-weight": "bold",
                                        "font-size": "inherit",
                                        padding: 0,
                                    }}
                                >
                                    Method
                                    <Show when={sortBy() === "method" && sortDirection() === "desc"}>
                                        <ChevronDown style={{ width: "14px", height: "14px" }} />
                                    </Show>
                                    <Show when={sortBy() === "method" && sortDirection() === "asc"}>
                                        <ChevronUp style={{ width: "14px", height: "14px" }} />
                                    </Show>
                                </button>
                            </TableHeaderCell>
                            <TableHeaderCell>MCP Gateway</TableHeaderCell>
                            <TableHeaderCell>MCP Server</TableHeaderCell>
                            <TableHeaderCell>Tool name</TableHeaderCell>
                            <TableHeaderCell>Arguments</TableHeaderCell>
                            <TableHeaderCell>Status</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <For each={toolCalls()}>
                            {(toolCall) => (
                                <tr
                                    onClick={() => setSearchParams({ logId: toolCall.id })}
                                    style={{ cursor: "pointer" }}
                                >
                                    <TableCell>
                                        <AgentBadge agentId={toolCall.agentId}>
                                            {getProfileName(toolCall.agentId)}
                                        </AgentBadge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={methodBadgeVariant(toolCall.method)}>{toolCall.method}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="muted">{getProfileName(toolCall.agentId)}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Show when={toolCall.mcpServerName}>
                                            <Badge variant="muted">{toolCall.mcpServerName}</Badge>
                                        </Show>
                                        <Show when={!toolCall.mcpServerName}>
                                            <span style={{ color: "var(--muted-foreground)" }}>-</span>
                                        </Show>
                                    </TableCell>
                                    <TableCell>{toolCall.toolCall?.name ?? "-"}</TableCell>
                                    <TableCell>
                                        <TruncatedText message={getArguments(toolCall)} maxLength={60} />
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                (toolCall.toolResult as ToolResult)?.isError ? "destructive" : "success"
                                            }
                                        >
                                            {(toolCall.toolResult as ToolResult)?.isError ? "Error" : "Success"}
                                        </Badge>
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

            <McpToolCallDrawer
                mcpToolCallId={drawerToolCallId()}
                open={drawerOpen()}
                onOpenChange={(open) => {
                    if (!open) setSearchParams({ logId: undefined });
                }}
            />
        </>
    );
}
