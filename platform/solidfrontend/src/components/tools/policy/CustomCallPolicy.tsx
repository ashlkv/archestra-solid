import { For, type JSX, Show } from "solid-js";
import { ArrowRight, Plus, Trash2 } from "@/components/icons";
import type { PolicyCondition } from "@/lib/policy.utils";
import type { CallPolicy } from "@/types";

type CallPolicyAction = CallPolicy["action"];
import { Button } from "../../primitives/Button";
import { DestructiveButton } from "../../primitives/DestructiveButton";
import { Input } from "../../primitives/Input";
import { Select } from "../../primitives/Select";
import { Tooltip } from "../../primitives/Tooltip";
import { CallPolicyCondition } from "./CallPolicyCondition";
import styles from "./CustomCallPolicy.module.css";
import { clsx } from "clsx"

export function CustomCallPolicy(props: {
    conditions: PolicyCondition[];
    action: CallPolicyAction;
    reason: string | undefined;
    conditionKeyOptions: { argumentNames: string[]; contextOptions: string[] };
    callActionOptions: { value: string; label: string }[];
    onDelete: () => void;
    onConditionsChange: (conditions: PolicyCondition[]) => void;
    onActionChange: (action: CallPolicyAction) => void;
    onReasonChange: (reason: string) => void;
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
        const defaultKey =
            props.conditionKeyOptions.argumentNames[0] ?? props.conditionKeyOptions.contextOptions[0] ?? "";
        props.onConditionsChange([
            ...props.conditions,
            { key: defaultKey, operator: "equal", value: "" },
        ]);
    };

    return (
        <div class={clsx(styles.policy, props.class, props.conditions.length === 1 && styles["simple"])} data-label="Policy card">
            <For each={props.conditions}>
                {(condition, index) => (
                    <div class={styles.row}>
                        <div class={styles.if}>
                            {index() === 0 ? "If" : "and"}
                        </div>
                        <CallPolicyCondition
                            condition={condition}
                            conditionKeyOptions={props.conditionKeyOptions}
                            removable={props.conditions.length > 1}
                            onChange={(updated) => onConditionChange(index(), updated)}
                            onRemove={() => onConditionRemove(index())}
                        />
                        <Show when={index() === props.conditions.length - 1}>
                                <Button
                                    size="icon"
                                    onClick={onConditionAdd}
                                    aria-label="Add condition"
                                    tooltip="Add condition"
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
                    onChange={(action) => props.onActionChange(action as CallPolicyAction)}
                    options={props.callActionOptions}
                    size="small"
                />
                <Input
                    placeholder="Reason"
                    value={props.reason ?? ""}
                    onInput={props.onReasonChange}
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
