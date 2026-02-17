import { type JSX, Show } from "solid-js";
import { JsonSection } from "@/components/logs/JsonSection";
import { AgentBadge } from "@/components/primitives/AgentBadge";
import { Badge } from "@/components/primitives/Badge";
import { Spinner } from "@/components/primitives/Spinner";
import { useAgents } from "@/lib/agent.query";
import { formatDate } from "@/lib/interaction.utils";
import { useMcpToolCall } from "@/lib/mcp-tool-call.query";
import type { Agent } from "@/types";

type ToolResult = { isError?: boolean };

export function McpToolCallDetailContent(props: { mcpToolCallId: string }): JSX.Element {
    const { data: toolCall, query: toolCallQuery } = useMcpToolCall(() => ({
        mcpToolCallId: props.mcpToolCallId,
    }));
    const { data: agents } = useAgents();

    const getProfileName = (agentId: string): string => {
        const agentList = agents() ?? [];
        return agentList.find((a: Agent) => a.id === agentId)?.name ?? agentId;
    };

    return (
        <>
            <Show when={toolCallQuery.pending}>
                <div style={{ display: "flex", "justify-content": "center", padding: "3rem" }}>
                    <Spinner />
                </div>
            </Show>

            <Show when={!toolCallQuery.pending && toolCallQuery.error}>
                <div style={{ color: "var(--destructive)", padding: "1rem" }}>
                    Failed to load tool call: {toolCallQuery.error?.message}
                </div>
            </Show>

            <Show when={!toolCallQuery.pending && !toolCallQuery.error && toolCall()}>
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
                                    "font-size": "var(--small-font-size)",
                                    color: "var(--muted-foreground)",
                                    "margin-bottom": "0.25rem",
                                }}
                            >
                                MCP Gateway
                            </div>
                            <AgentBadge agentId={toolCall()!.agentId}>{getProfileName(toolCall()!.agentId)}</AgentBadge>
                        </div>
                        <div>
                            <div
                                style={{
                                    "font-size": "var(--small-font-size)",
                                    color: "var(--muted-foreground)",
                                    "margin-bottom": "0.25rem",
                                }}
                            >
                                Method
                            </div>
                            <Badge variant="secondary">{toolCall()!.method}</Badge>
                        </div>
                        <div>
                            <div
                                style={{
                                    "font-size": "var(--small-font-size)",
                                    color: "var(--muted-foreground)",
                                    "margin-bottom": "0.25rem",
                                }}
                            >
                                MCP Server
                            </div>
                            <Show when={toolCall()!.mcpServerName}>
                                <Badge variant="muted">{toolCall()!.mcpServerName}</Badge>
                            </Show>
                            <Show when={!toolCall()!.mcpServerName}>
                                <span style={{ color: "var(--muted-foreground)" }}>-</span>
                            </Show>
                        </div>
                        <div>
                            <div
                                style={{
                                    "font-size": "var(--small-font-size)",
                                    color: "var(--muted-foreground)",
                                    "margin-bottom": "0.25rem",
                                }}
                            >
                                Status
                            </div>
                            <Badge
                                variant={(toolCall()!.toolResult as ToolResult)?.isError ? "destructive" : "success"}
                            >
                                {(toolCall()!.toolResult as ToolResult)?.isError ? "Error" : "Success"}
                            </Badge>
                        </div>
                        <div>
                            <div
                                style={{
                                    "font-size": "var(--small-font-size)",
                                    color: "var(--muted-foreground)",
                                    "margin-bottom": "0.25rem",
                                }}
                            >
                                Tool name
                            </div>
                            <div>{toolCall()!.toolCall?.name ?? "-"}</div>
                        </div>
                        <div>
                            <div
                                style={{
                                    "font-size": "var(--small-font-size)",
                                    color: "var(--muted-foreground)",
                                    "margin-bottom": "0.25rem",
                                }}
                            >
                                Timestamp
                            </div>
                            <div style={{ "font-size": "var(--small-font-size)" }}>
                                {formatDate(toolCall()!.createdAt)}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: "grid", gap: "1rem" }}>
                    <JsonSection title="Arguments" data={toolCall()!.toolCall?.arguments} />
                    <JsonSection title="Result" data={toolCall()!.toolResult} defaultOpen />
                </div>
            </Show>
        </>
    );
}
