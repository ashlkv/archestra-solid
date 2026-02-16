import type { JSX } from "solid-js";
import { Tooltip } from "../primitives/Tooltip";
import styles from "./AgentMiniBadge.module.css";

const PALETTE_SIZE = 18;

export function AgentMiniBadge(props: { agentId: string; agentName: string }): JSX.Element {
    const cssVar = () => `var(--color-${colorIndex(props.agentId)})`;
    const initials = () => getInitials(props.agentName);

    return (
        <Tooltip content={props.agentName}>
            <span
                class={styles.badge}
                style={{ background: cssVar(), color: `color-mix(in srgb, ${cssVar()} 40%, black)` }}
                data-label={`Mini: ${props.agentName}`}
            >
                {initials()}
            </span>
        </Tooltip>
    );
}

function colorIndex(agentId: string): number {
    const lastChar = agentId.replace(/-/g, "").slice(-1);
    const num = Number.parseInt(lastChar, 16);
    return (Number.isNaN(num) ? 0 : num) % PALETTE_SIZE;
}

function getInitials(name: string): string {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}
