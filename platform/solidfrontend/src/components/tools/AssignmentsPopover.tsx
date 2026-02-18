import { type Accessor, createSignal, type JSX } from "solid-js";
import { X } from "@/components/icons";
import { AgentBadge } from "@/components/primitives/AgentBadge";
import { useAssignTool } from "@/lib/agent.query";
import { useUnassignTool } from "@/lib/tool.query";
import { Button } from "../primitives/Button";
import { MultiSelect } from "../primitives/MultiSelect";
import styles from "./AssignmentsPopover.module.css";

type Agent = { id: string; name: string };

export function AssignmentsPopover(props: {
    toolId: string;
    selectedIds: string[];
    agents: Accessor<Agent[] | undefined>;
    onClose?: () => void;
}): JSX.Element {
    const [localIds, setLocalIds] = createSignal(props.selectedIds, { name: "localIds" });
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

    const renderTag = (option: { value: string; label: string }, onDelete: () => void) => (
        <span class={styles.tag} onPointerDown={(e) => e.stopPropagation()}>
            <AgentBadge agentId={option.value}>{option.label}</AgentBadge>
            <button type="button" class={styles.tagDelete} onClick={onDelete} aria-label={`Remove ${option.label}`}>
                <X size={14} />
            </button>
        </span>
    );

    return (
        <div class={styles.content}>
            <MultiSelect
                value={localIds()}
                onChange={setLocalIds}
                options={options()}
                placeholder="Select profile"
                tagsLayout="vertical"
                renderTag={renderTag}
            />
            <div class={styles.actions}>
                <Button onClick={onSave} disabled={pending()}>
                    Save
                </Button>
            </div>
        </div>
    );
}
