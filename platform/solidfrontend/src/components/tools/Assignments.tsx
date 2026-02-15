import { type Accessor, createSignal, type JSX, Show } from "solid-js";
import { Badge } from "../primitives/Badge";
import { Button } from "../primitives/Button";
import { Popover, PopoverContent, PopoverTrigger } from "../primitives/Popover";
import { Tooltip } from "../primitives/Tooltip";
import { AgentBadge } from "./AgentBadge";
import styles from "./Assignments.module.css";
import { AssignmentsPopover } from "./AssignmentsPopover";

type Agent = { id: string; name: string };
type Assignment = { agent: Agent };

export function Assignments(props: {
    toolId: string;
    assignments: Assignment[];
    agents: Accessor<Agent[] | undefined>;
    readOnly?: boolean;
    priorityAgentId?: string;
}): JSX.Element {
    const [open, setOpen] = createSignal(false);

    const sortedAssignments = () => {
        if (!props.priorityAgentId) return props.assignments;
        const id = props.priorityAgentId;
        return [...props.assignments].sort((a, b) => {
            if (a.agent.id === id) return -1;
            if (b.agent.id === id) return 1;
            return 0;
        });
    };

    const first = () => sortedAssignments()[0]?.agent;
    const remaining = () => Math.max(0, sortedAssignments().length - 1);
    const hasAssignments = () => props.assignments.length > 0;
    const selectedIds = () => props.assignments.map((a) => a.agent.id);
    const isAssignmentMode = () => !!props.priorityAgentId;
    const isAssignedToCurrentAgent = () =>
        !!props.priorityAgentId && props.assignments.some((a) => a.agent.id === props.priorityAgentId);
    const otherAgentCount = () => {
        if (!props.priorityAgentId) return props.assignments.length;
        return props.assignments.filter((a) => a.agent.id !== props.priorityAgentId).length;
    };
    const otherAgentLabel = () => {
        const count = otherAgentCount();
        return count === 1 ? "1 other agent" : `${count} other agents`;
    };

    if (props.readOnly) {
        return (
            <Show when={hasAssignments()} fallback={<span class={styles.disconnected}>Not connected</span>}>
                <Tooltip content="Auto-discovered tool, bound to this agent">
                    <span class={styles.content}>
                        <Badge variant="muted">{first()!.name}</Badge>
                        <Show when={remaining() > 0}>
                            <span class={styles.count}>+{remaining()}</span>
                        </Show>
                    </span>
                </Tooltip>
            </Show>
        );
    }

    return (
        <Popover open={open()} onOpenChange={setOpen}>
            <PopoverTrigger>
                <div class={styles.trigger}>
                    <Show
                        when={isAssignmentMode()}
                        fallback={
                            <Show
                                when={hasAssignments()}
                                fallback={
                                    <>
                                        <span class={`${styles.content} ${styles.disconnected}`}>Not connected</span>
                                        <Button size="small" class={styles.connect}>
                                            Connect
                                        </Button>
                                    </>
                                }
                            >
                                <span class={styles.content}>
                                    <Badge variant="muted">{first()!.name}</Badge>
                                    <Show when={remaining() > 0}>
                                        <span class={styles.count}>+{remaining()}</span>
                                    </Show>
                                </span>
                                <Button size="small" class={styles.edit}>
                                    Edit
                                </Button>
                            </Show>
                        }
                    >
                        <span class={styles.content}>
                            <Show when={!hasAssignments()}>
                                <span class={styles.muted}>Not assigned to any agent</span>
                            </Show>
                            <Show when={hasAssignments() && !isAssignedToCurrentAgent()}>
                                <span>{otherAgentLabel()}</span>
                            </Show>
                            <Show when={isAssignedToCurrentAgent()}>
                                <AgentBadge agentId={props.priorityAgentId!}>
                                    {props.assignments.find((a) => a.agent.id === props.priorityAgentId)?.agent.name}
                                </AgentBadge>
                                <Show when={otherAgentCount() > 0}>
                                    <span>+ {otherAgentLabel()}</span>
                                </Show>
                            </Show>
                        </span>
                    </Show>
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <AssignmentsPopover
                    toolId={props.toolId}
                    selectedIds={selectedIds()}
                    agents={props.agents}
                    onClose={() => setOpen(false)}
                />
            </PopoverContent>
        </Popover>
    );
}
