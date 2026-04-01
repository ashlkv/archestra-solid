import type { JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import { getIcon } from "@/mcp-icons";
import { IconClaudeCode } from "@/mcp-icons/IconClaudeCode";
import styles from "./OriginBadge.module.css";

type BadgeColor = { bg: string; fg: string };

type OriginStyle = { color: BadgeColor };

const ORIGIN_STYLES: Record<string, OriginStyle> = {
    archestra: { color: { bg: "var(--foreground)", fg: "var(--background)" } },
    github: { color: { bg: "#24292f", fg: "#ffffff" } },
    kubernetes: { color: { bg: "#326ce5", fg: "#ffffff" } },
    k8s: { color: { bg: "#326ce5", fg: "#ffffff" } },
    playwright: { color: { bg: "color-mix(in srgb, var(--foreground) 15%, transparent)", fg: "var(--foreground)" } },
    jira: { color: { bg: "#0052cc", fg: "#ffffff" } },
    context7: { color: { bg: "#1a1a1a", fg: "#ffffff" } },
    "claude code": { color: { bg: "#d97757", fg: "#ffffff" } },
};

const DEFAULT_COLOR: BadgeColor = {
    bg: "color-mix(in srgb, var(--foreground) 15%, transparent)",
    fg: "var(--foreground)",
};

export function OriginBadge(props: { toolName: string; mcpServerName?: string | null; size?: "small" | "medium"; class?: string }): JSX.Element {
    const origin = () => resolveOrigin(props.toolName, props.mcpServerName);
    const color = () => origin().originStyle?.color ?? DEFAULT_COLOR;

    return (
        <span class={`${styles.badge} ${props.size === "medium" ? styles.medium : ""} ${props.class ?? ""}`}>
            <span class={styles["icon-section"]} style={{ background: color().bg, color: color().fg }}>
                <Dynamic
                    component={origin().icon}
                    size={14}
                    class={`${styles.icon} ${origin().originStyle ? styles["icon-colored"] : ""}`}
                />
            </span>
            <span class={styles.label}>{origin().label}</span>
        </span>
    );
}

type Origin = {
    label: string;
    originStyle?: OriginStyle;
    icon: (props: { size?: number; class?: string }) => JSX.Element;
};

function resolveOrigin(toolName: string, mcpServerName?: string | null): Origin {
    const name = mcpServerName ?? extractServerName(toolName);

    if (name) {
        const style = findStyle(name);
        return { label: name, originStyle: style, icon: getIcon(name) };
    }

    // No MCP server — currently only Claude Code uses LLM Proxy as external agent
    return { label: "Claude Code", originStyle: ORIGIN_STYLES["claude code"], icon: IconClaudeCode };
}

function extractServerName(toolName: string): string | undefined {
    if (toolName.startsWith("archestra__")) return "archestra";
    const lastSep = toolName.lastIndexOf("__");
    if (lastSep !== -1) return toolName.slice(0, lastSep);
    return undefined;
}

function findStyle(name: string): OriginStyle | undefined {
    const key = name.toLowerCase();
    for (const [pattern, style] of Object.entries(ORIGIN_STYLES)) {
        if (key.includes(pattern)) return style;
    }
    return undefined;
}
