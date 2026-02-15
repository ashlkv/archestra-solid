import { type JSX, Show } from "solid-js";
import { useTools } from "@/lib/tool.query";
import { ToolHoverCard } from "./ToolHoverCard";
import styles from "./ToolName.module.css";

/**
 * Displays a tool's short method name with an optional hover card showing the tool signature.
 *
 * - When `tool` is provided, uses it directly for the hover card (no query).
 * - When only `name` is provided, queries for the tool to get description/parameters.
 */
export function ToolName(props: {
    name: string;
    tool?: { description: string | null; parameters?: Record<string, unknown> };
}): JSX.Element {
    const { data: tools } = useTools(() => ({ limit: 10, offset: 0, search: shortName(props.name) }));
    const resolved = () => props.tool ?? tools()?.find((t) => t.name === props.name);
    const label = () => <span class={styles.name}>{shortName(props.name)}</span>;

    return (
        <Show when={resolved()} fallback={label()}>
            <ToolHoverCard
                name={shortName(props.name)}
                description={resolved()!.description}
                parameters={resolved()!.parameters as any}
            >
                {label()}
            </ToolHoverCard>
        </Show>
    );
}

function shortName(name: string): string {
    const lastSep = name.lastIndexOf("__");
    return lastSep !== -1 ? name.slice(lastSep + 2) : name;
}
