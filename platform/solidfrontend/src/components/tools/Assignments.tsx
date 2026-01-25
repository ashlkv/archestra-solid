import { createSignal, Show, type Accessor, type JSX } from "solid-js";
import { Badge } from "../primitives/Badge";
import { Button } from "../primitives/Button";
import { Popover, PopoverContent, PopoverTrigger } from "../primitives/Popover";
import { AssignmentsPopover } from "./AssignmentsPopover";
import styles from "./Assignments.module.css";

type Agent = { id: string; name: string };
type Assignment = { agent: Agent };

export function Assignments(props: { toolId: string; assignments: Assignment[]; agents: Accessor<Agent[] | undefined> }): JSX.Element {
    const [open, setOpen] = createSignal(false);

    const first = () => props.assignments[0]?.agent;
    const remaining = () => Math.max(0, props.assignments.length - 1);
    const hasAssignments = () => props.assignments.length > 0;
    const selectedIds = () => props.assignments.map((a) => a.agent.id);

    return (
        <Popover open={open()} onOpenChange={setOpen}>
            <PopoverTrigger>
                <div class={styles.trigger}>
                    <Show
                        when={hasAssignments()}
                        fallback={
                            <>
                                <span class={styles.disconnected}>Not connected</span>
                                <Button size="small" class={styles.connect}>Connect</Button>
                            </>
                        }
                    >
                        <Badge variant="muted">{first()!.name}</Badge>
                        <Show when={remaining() > 0}>
                            <span class={styles.count}>+{remaining()}</span>
                        </Show>
                        <Button size="small" class={styles.edit}>Edit</Button>
                    </Show>
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <AssignmentsPopover toolId={props.toolId} selectedIds={selectedIds()} agents={props.agents} onClose={() => setOpen(false)} />
            </PopoverContent>
        </Popover>
    );
}
