import type { JSX } from "solid-js";
import { Show } from "solid-js";
import { Select } from "@/components/primitives/Select";
import { Spinner } from "@/components/primitives/Spinner";
import { useAgents } from "@/lib/agent.query";
import styles from "./AgentSelector.module.css";

export function AgentSelector(props: {
    agentId: string | undefined;
    onAgentChange: (agentId: string) => void;
    disabled?: boolean;
}): JSX.Element {
    const { data: agents, query } = useAgents(undefined as undefined);

    const options = () =>
        (agents() ?? []).map((agent) => ({
            value: agent.id,
            label: agent.name,
        }));

    return (
        <>
            <Show when={!query.pending}>
                <Select
                    class={styles.selector}
                    value={props.agentId ?? ""}
                    onChange={props.onAgentChange}
                    options={options()}
                    placeholder="Select agent"
                    disabled={props.disabled}
                    loading={query.pending}
                />
            </Show>
            <Show when={query.pending}>
                <Spinner size={16} />
            </Show>
        </>
    );
}
