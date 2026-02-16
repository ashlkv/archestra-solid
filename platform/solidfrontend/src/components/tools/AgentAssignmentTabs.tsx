import { type Accessor, For, Show } from "solid-js";
import { AgentBadge } from "@/components/primitives/AgentBadge";
import { Count } from "../primitives/Count";
import { Tab, TabList, Tabs } from "../primitives/Tabs";
import styles from "./AgentAssignmentTabs.module.css";

type Agent = { id: string; name: string };
type Tool = { assignments: { agent: { id: string } }[] };

const MASTER_TAB = "__master__";

export function AgentAssignmentTabs(props: {
    agents: Accessor<Agent[] | undefined>;
    tools: Accessor<Tool[] | undefined>;
    selectedAgentId: string | undefined;
    onSelect: (agentId: string | undefined) => void;
}) {
    const tabValue = () => props.selectedAgentId ?? MASTER_TAB;

    function handleChange(value: string) {
        props.onSelect(value === MASTER_TAB ? undefined : value);
    }

    function assignedCount(agentId: string): number {
        return (props.tools() ?? []).filter((t) => t.assignments.some((a) => a.agent.id === agentId)).length;
    }

    const totalTools = () => (props.tools() ?? []).length;

    return (
        <Show when={props.agents()?.length}>
            <Tabs orientation="horizontal" value={tabValue()} onChange={handleChange}>
                <TabList class={styles.list}>
                    <Tab value={MASTER_TAB}>All tools</Tab>
                    <span class={styles.separator} />
                    <span class={styles.label}>By agent</span>
                    <For each={props.agents()}>
                        {(agent) => (
                            <Tab value={agent.id}>
                                <AgentBadge agentId={agent.id}>
                                    {agent.name}
                                    <span class={styles.count}>
                                        <Count count={assignedCount(agent.id)} total={totalTools()} />
                                    </span>
                                </AgentBadge>
                            </Tab>
                        )}
                    </For>
                </TabList>
            </Tabs>
        </Show>
    );
}
