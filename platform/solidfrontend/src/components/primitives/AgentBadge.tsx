import type { JSX, ParentProps } from "solid-js";
import { Badge } from "./Badge";

const PALETTE_SIZE = 18;

function colorIndex(agentId: string): number {
    const lastChar = agentId.replace(/-/g, "").slice(-1);
    const num = Number.parseInt(lastChar, 16);
    return (Number.isNaN(num) ? 0 : num) % PALETTE_SIZE;
}

export function AgentBadge(props: ParentProps<{ agentId: string }>): JSX.Element {
    const cssVar = () => `var(--color-${colorIndex(props.agentId)})`;

    return (
        <Badge style={{ background: cssVar(), color: `color-mix(in srgb, ${cssVar()} 40%, black)` }}>
            {props.children}
        </Badge>
    );
}
