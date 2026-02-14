import { type Accessor, createSignal, type JSX, Show } from "solid-js";
import { Badge } from "../primitives/Badge";
import { Button } from "../primitives/Button";
import { Popover, PopoverContent, PopoverTrigger } from "../primitives/Popover";
import { Tooltip } from "../primitives/Tooltip";
import styles from "./Assignments.module.css";
import { AssignmentsPopover } from "./AssignmentsPopover";

type Agent = { id: string; name: string };
type Assignment = { agent: Agent };

export function Assignments(props: {
    toolId: string;
    assignments: Assignment[];
    agents: Accessor<Agent[] | undefined>;
    readOnly?: boolean;
}): JSX.Element {
    const [open, setOpen] = createSignal(false);

    const first = () => props.assignments[0]?.agent;
    const remaining = () => Math.max(0, props.assignments.length - 1);
    const hasAssignments = () => props.assignments.length > 0;
    const selectedIds = () => props.assignments.map((a) => a.agent.id);

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
