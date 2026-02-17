import { clsx } from "clsx";
import { For, type JSX, Show } from "solid-js";
import { ArrowRight, Plus, Trash2 } from "@/components/icons";
import type { PolicyCondition } from "@/lib/policy.utils";
import type { ResultPolicy } from "@/types";
import { Button } from "../../primitives/Button";
import { DestructiveButton } from "../../primitives/DestructiveButton";
import { Select } from "../../primitives/Select";
import { ResultPolicyCondition } from "./ResultPolicyCondition";
import styles from "./CustomResultPolicy.module.css";

type ResultPolicyAction = ResultPolicy["action"];

export function CustomResultPolicy(props: {
    conditions: PolicyCondition[];
    action: ResultPolicyAction;
    keyItems: { value: string; label: string }[];
    resultActionOptions: { value: string; label: string }[];
    onDelete: () => void;
    onConditionsChange: (conditions: PolicyCondition[]) => void;
    onActionChange: (action: ResultPolicyAction) => void;
    class?: string;
}): JSX.Element {
    const onConditionChange = (index: number, updatedCondition: PolicyCondition) => {
        const newConditions = [...props.conditions];
        newConditions[index] = updatedCondition;
        props.onConditionsChange(newConditions);
    };

    const onConditionRemove = (index: number) => {
        const newConditions = props.conditions.filter(
            (_: unknown, conditionIndex: number) => conditionIndex !== index,
        );
        props.onConditionsChange(newConditions);
    };

    const onConditionAdd = () => {
        props.onConditionsChange([
            ...props.conditions,
            { key: "", operator: "equal", value: "" },
        ]);
    };

    return (
        <div class={clsx(styles.policy, props.class, props.conditions.length === 1 && styles["simple"])} data-label="Result policy card">
            <For each={props.conditions}>
                {(condition, index) => (
                    <div class={styles.row}>
                        <div class={styles.if}>
                            {index() === 0 ? "If" : "and"}
                        </div>
                        <ResultPolicyCondition
                            condition={condition}
                            keyItems={props.keyItems}
                            removable={props.conditions.length > 1}
                            onChange={(updated) => onConditionChange(index(), updated)}
                            onRemove={() => onConditionRemove(index())}
                        />
                        <Show when={index() === props.conditions.length - 1}>
                            <Button
                                variant="outline"
                                size="icon-small"
                                tooltip="Add condition"
                                aria-label="Add condition"
                                onClick={onConditionAdd}
                            >
                                <Plus size={14} />
                            </Button>
                        </Show>
                    </div>
                )}
            </For>
            <div class={styles.row}>
                <div class={styles.then}>
                    <ArrowRight size={16} />
                </div>
                <Select
                    value={props.action}
                    onChange={(action) => props.onActionChange(action as ResultPolicyAction)}
                    options={props.resultActionOptions}
                    size="small"
                />
                <DestructiveButton
                    size="icon"
                    tooltip="Delete policy"
                    onClick={props.onDelete}
                    aria-label="Delete policy"
                >
                    <Trash2 size={16} />
                </DestructiveButton>
            </div>
        </div>
    );
}
