import { A, useParams } from "@solidjs/router";
import { type JSX, Show } from "solid-js";
import { ArrowLeft } from "@/components/icons";
import { JsonSection } from "@/components/logs/JsonSection";
import { Badge } from "@/components/primitives/Badge";
import { PageHeader } from "@/components/primitives/PageHeader";
import { Spinner } from "@/components/primitives/Spinner";
import { useAgents } from "@/lib/agent.query";
import { formatDate } from "@/lib/interaction.utils";
import { useMcpToolCall } from "@/lib/mcp-tool-call.query";
import type { Agent } from "@/types";

type ToolResult = { isError?: boolean };

export default function McpToolCallDetailPage(): JSX.Element {
    const params = useParams<{ id: string }>();
    const { data: toolCall, query: toolCallQuery } = useMcpToolCall(() => ({ mcpToolCallId: params.id }));
    const { data: agents } = useAgents();

    const getProfileName = (agentId: string): string => {
        const agentList = agents() ?? [];
        return agentList.find((a: Agent) => a.id === agentId)?.name ?? agentId;
    };

    return (
        <>
            <div style={{ display: "flex", "align-items": "center", gap: "0.5rem", "margin-bottom": "1rem" }}>
                <A href="/logs/mcp-gateway" style={{ color: "var(--muted-foreground)" }}>
                    <ArrowLeft style={{ width: "20px", height: "20px" }} />
                </A>
                <PageHeader title="MCP Tool Call" />
            </div>

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
                                    "font-size": "var(--font-size-xsmall)",
                                    color: "var(--muted-foreground)",
                                    "margin-bottom": "0.25rem",
                                }}
                            >
                                MCP Gateway
                            </div>
                            <div>{getProfileName(toolCall()!.agentId)}</div>
                        </div>
                        <div>
                            <div
                                style={{
                                    "font-size": "var(--font-size-xsmall)",
                                    color: "var(--muted-foreground)",
                                    "margin-bottom": "0.25rem",
                                }}
                            >
                                Method
                            </div>
                            <Badge variant="primary">{toolCall()!.method}</Badge>
                        </div>
                        <div>
                            <div
                                style={{
                                    "font-size": "var(--font-size-xsmall)",
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
                                    "font-size": "var(--font-size-xsmall)",
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
                                    "font-size": "var(--font-size-xsmall)",
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
                                    "font-size": "var(--font-size-xsmall)",
                                    color: "var(--muted-foreground)",
                                    "margin-bottom": "0.25rem",
                                }}
                            >
                                Timestamp
                            </div>
                            <div style={{ "font-size": "var(--font-size-small)" }}>
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
