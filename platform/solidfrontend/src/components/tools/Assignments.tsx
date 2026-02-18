import { type Accessor, createSignal, For, type JSX, Show } from "solid-js";
import { AgentBadge } from "@/components/primitives/AgentBadge";
import { PencilButton } from "../primitives/PencilButton";
import { Popover, PopoverContent, PopoverTrigger } from "../primitives/Popover";
import { Tooltip } from "../primitives/Tooltip";
import { AgentMiniBadge } from "./AgentMiniBadge";
import styles from "./Assignments.module.css";
import { AssignmentsPopover } from "./AssignmentsPopover";

type Agent = { id: string; name: string };
type Assignment = { agent: Agent };

const MAX_COMPACT_BADGES = 4;

export function Assignments(props: {
    toolId: string;
    assignments: Assignment[];
    agents: Accessor<Agent[] | undefined>;
    readOnly?: boolean;
    compact?: boolean;
    priorityAgentId?: string;
}): JSX.Element {
    const [open, setOpen] = createSignal(false, { name: "open" });

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

    const visibleCompactAssignments = () => sortedAssignments().slice(0, MAX_COMPACT_BADGES);
    const compactOverflow = () => Math.max(0, sortedAssignments().length - MAX_COMPACT_BADGES);

    if (props.readOnly) {
        return (
            <>
                <Show when={first()}>
                    {(agent) => (
                        <Tooltip content="Auto-discovered tool, bound to this agent">
                            <span class={styles.content}>
                                <AgentBadge agentId={agent().id}>{agent().name}</AgentBadge>
                                <Show when={remaining() > 0}>
                                    <span class={styles.count}>+{remaining()}</span>
                                </Show>
                            </span>
                        </Tooltip>
                    )}
                </Show>
                <Show when={!hasAssignments()}>
                    <span class={styles.disconnected}>Not connected</span>
                </Show>
            </>
        );
    }

    return (
        <Popover open={open()} onOpenChange={setOpen}>
            <PopoverTrigger>
                <div class={styles.trigger}>
                    <Show when={props.compact && !isAssignmentMode()}>
                        <CompactContent
                            hasAssignments={hasAssignments()}
                            visible={visibleCompactAssignments()}
                            overflow={compactOverflow()}
                            onEdit={() => setOpen(true)}
                        />
                    </Show>
                    <Show when={!props.compact && !isAssignmentMode()}>
                        <DefaultContent hasAssignments={hasAssignments()} first={first()} remaining={remaining()} />
                    </Show>
                    <Show when={isAssignmentMode()}>
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

function CompactContent(props: {
    hasAssignments: boolean;
    visible: Assignment[];
    overflow: number;
    onEdit: () => void;
}): JSX.Element {
    return (
        <>
            <Show when={!props.hasAssignments}>
                <span class={`${styles.content} ${styles.disconnected}`}>Not connected</span>
                <PencilButton tooltip="Edit assignments" variant="ghost" size="icon-small" class={styles.edit} />
            </Show>
            <Show when={props.hasAssignments}>
                <span class={styles.content}>
                    <For each={props.visible}>
                        {(assignment) => (
                            <AgentMiniBadge agentId={assignment.agent.id} agentName={assignment.agent.name} />
                        )}
                    </For>
                    <Show when={props.overflow > 0}>
                        <span class={styles.count}>+{props.overflow}</span>
                    </Show>
                </span>
                <PencilButton tooltip="Edit assignments" variant="ghost" size="icon-small" class={styles.edit} />
            </Show>
        </>
    );
}

function DefaultContent(props: { hasAssignments: boolean; first: Agent | undefined; remaining: number }): JSX.Element {
    return (
        <>
            <Show when={!props.hasAssignments}>
                <span class={`${styles.content} ${styles.disconnected}`}>Not connected</span>
                <PencilButton tooltip="Edit assignments" variant="ghost" size="icon-small" class={styles.edit} />
            </Show>
            <Show when={props.first}>
                {(agent) => (
                    <>
                        <span class={styles.content}>
                            <AgentBadge agentId={agent().id}>{agent().name}</AgentBadge>
                            <Show when={props.remaining > 0}>
                                <span class={styles.count}>+{props.remaining}</span>
                            </Show>
                        </span>
                        <PencilButton
                            tooltip="Edit assignments"
                            variant="ghost"
                            size="icon-small"
                            class={styles.edit}
                        />
                    </>
                )}
            </Show>
        </>
    );
}
