import { createSignal, type Accessor, type JSX } from "solid-js";
import { Button } from "../primitives/Button";
import { MultiSelect } from "../primitives/MultiSelect";
import { useAssignTool } from "@/lib/agent.query";
import { useUnassignTool } from "@/lib/tool.query";
import styles from "./Assignments.module.css";

type Agent = { id: string; name: string };

export function AssignmentsPopover(props: { toolId: string; selectedIds: string[]; agents: Accessor<Agent[] | undefined>; onClose?: () => void }): JSX.Element {
    const [localIds, setLocalIds] = createSignal(props.selectedIds);
    const { submit: assign, submission: assignSubmission } = useAssignTool(props.toolId);
    const { submit: unassign, submission: unassignSubmission } = useUnassignTool();

    const options = () => props.agents()?.map((agent) => ({ value: agent.id, label: agent.name })) ?? [];
    const pending = () => assignSubmission.pending || unassignSubmission.pending;
    const error = () => assignSubmission.error || unassignSubmission.error;

    const onSave = async () => {
        const toAdd = localIds().filter((id) => !props.selectedIds.includes(id));
        const toRemove = props.selectedIds.filter((id) => !localIds().includes(id));

        for (const agentId of toAdd) {
            await assign({ agentId, toolId: props.toolId });
        }
        for (const agentId of toRemove) {
            await unassign({ agentId, toolId: props.toolId });
        }

        if (!error()) {
            props.onClose?.();
        }
    };

    return (
        <div class={styles.popoverContent}>
            <MultiSelect
                value={localIds()}
                onChange={setLocalIds}
                options={options()}
                placeholder="Search profiles..."
                tagsLayout="vertical"
            />
            <div class={styles.popoverActions}>
                <Button onClick={onSave} disabled={pending()}>Save</Button>
            </div>
        </div>
    );
}
