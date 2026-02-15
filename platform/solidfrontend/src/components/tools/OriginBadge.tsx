import type { JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import { getIcon } from "@/components/mcp-icons";
import { IconClaudeCode } from "@/components/mcp-icons/IconClaudeCode";
import { Badge } from "@/components/primitives/Badge";
import styles from "./OriginBadge.module.css";

/**
 * Displays a badge showing the origin of a tool.
 *
 * Smart defaults:
 * - If `mcpServerName` is provided, uses that directly.
 * - If the tool name contains `__`, extracts the server prefix.
 * - If `archestra__`, shows "archestra" with primary variant.
 * - Otherwise assumes "LLM Proxy" — and since Claude Code is currently the only
 *   external agent, shows the Claude Code icon + "Claude Code".
 */
export function OriginBadge(props: { toolName: string; mcpServerName?: string | null }): JSX.Element {
    const origin = () => resolveOrigin(props.toolName, props.mcpServerName);

    return (
        <Badge variant={origin().variant} class={styles.badge}>
            <Dynamic component={origin().icon} size={14} class={styles.icon} />
            <span class={styles.label}>{origin().label}</span>
        </Badge>
    );
}

type Origin = {
    label: string;
    variant: "primary" | "muted";
    icon: (props: { size?: number; class?: string }) => JSX.Element;
};

function resolveOrigin(toolName: string, mcpServerName?: string | null): Origin {
    if (toolName.startsWith("archestra__")) {
        return { label: "archestra", variant: "primary", icon: getIcon("archestra") };
    }

    // Explicit MCP server name from tool entity (available in full ToolTable)
    if (mcpServerName) {
        return { label: mcpServerName, variant: "muted", icon: getIcon(mcpServerName) };
    }

    // Extract server prefix from tool name convention: server__method
    const lastSep = toolName.lastIndexOf("__");
    if (lastSep !== -1) {
        const serverName = toolName.slice(0, lastSep);
        return { label: serverName, variant: "muted", icon: getIcon(serverName) };
    }

    // No MCP server — currently only Claude Code uses LLM Proxy as external agent
    return { label: "Claude Code", variant: "muted", icon: IconClaudeCode };
}
