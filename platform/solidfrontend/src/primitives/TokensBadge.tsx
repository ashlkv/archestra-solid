import type { JSX } from "solid-js";
import { Badge } from "./Badge";
import { Tooltip } from "./Tooltip";

interface Props {
    inputTokens: number;
    outputTokens: number;
    toonTokensBefore?: number | null;
    toonTokensAfter?: number | null;
    class?: string;
}

export function TokensBadge(props: Props): JSX.Element {
    const totalTokens = () => props.inputTokens + props.outputTokens;

    const toonTokensSaved = () => {
        if (props.toonTokensBefore && props.toonTokensAfter && props.toonTokensBefore > props.toonTokensAfter) {
            return props.toonTokensBefore - props.toonTokensAfter;
        }
        return null;
    };

    const tooltipContent = () => {
        const lines: string[] = [];
        lines.push(`Input: ${props.inputTokens.toLocaleString()} tokens`);
        lines.push(`Output: ${props.outputTokens.toLocaleString()} tokens`);
        lines.push(`Total: ${totalTokens().toLocaleString()} tokens`);
        const saved = toonTokensSaved();
        if (saved) {
            lines.push(`TOON compression: ${saved.toLocaleString()} tokens saved`);
        }
        return lines.join("\n");
    };

    return (
        <Tooltip content={tooltipContent()}>
            <Badge class={props.class}>
                {props.inputTokens.toLocaleString()} in / {props.outputTokens.toLocaleString()} out
            </Badge>
        </Tooltip>
    );
}
