import { A, useParams } from "@solidjs/router";
import type { JSX } from "solid-js";
import { ArrowLeft } from "@/components/icons";
import { McpToolCallDetailContent } from "@/components/logs/McpToolCallDetailContent";
import { PageHeader } from "@/components/primitives/PageHeader";

export default function McpToolCallDetailPage(): JSX.Element {
    const params = useParams<{ id: string }>();

    return (
        <>
            <div style={{ display: "flex", "align-items": "center", gap: "0.5rem", "margin-bottom": "1rem" }}>
                <A href="/logs/mcp-gateway" style={{ color: "var(--muted-foreground)" }}>
                    <ArrowLeft style={{ width: "20px", height: "20px" }} />
                </A>
                <PageHeader title="MCP Tool Call" />
            </div>

            <McpToolCallDetailContent mcpToolCallId={params.id} />
        </>
    );
}
