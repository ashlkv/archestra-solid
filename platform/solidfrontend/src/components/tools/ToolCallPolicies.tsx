import { CONTEXT_EXTERNAL_AGENT_ID, CONTEXT_TEAM_IDS } from "@shared";
import { For, type JSX, Show } from "solid-js";
import { ArrowRight, Plus } from "@/components/icons";
import {
    useCreateCallPolicy,
    useDeleteCallPolicy,
    useToolCallPolicies,
    useUniqueExternalAgentIds,
    useUpdateCallPolicy,
} from "@/lib/policy.query";
import {
    getCallPolicyActionFromPolicies,
    getConditionalPoliciesForTool,
    type PolicyCondition,
} from "@/lib/policy.utils";
import { useTeams } from "@/lib/team.query";
import type { CallPolicy } from "@/types";
import { Button } from "../primitives/Button";
import { Input } from "../primitives/Input";
import { Select } from "../primitives/Select";
import { Tooltip } from "../primitives/Tooltip";
import { CallPolicyCondition } from "./CallPolicyCondition";
import { CallPolicyToggle } from "./CallPolicyToggle";
import { PolicyCard } from "./PolicyCard";
import styles from "./ToolPolicies.module.css";
import { CALL_POLICY_ACTION_OPTIONS } from "./tool.utils";

type ToolForPolicies = {
    id: string;
    parameters?: { [key: string]: unknown };
};

export function ToolCallPolicies(props: { tool: ToolForPolicies }): JSX.Element {
    const { data: callPolicies } = useToolCallPolicies();
    const { submit: createPolicy } = useCreateCallPolicy();
    const { submit: deletePolicy } = useDeleteCallPolicy();
    const { submit: updatePolicy } = useUpdateCallPolicy();
    const { data: externalAgentIds } = useUniqueExternalAgentIds();
    const { data: teams } = useTeams();

    const conditionalPolicies = () => getConditionalPoliciesForTool(props.tool.id, callPolicies());

    const defaultPolicy = () => {
        const policies = callPolicies() ?? [];
        return policies.find((policy) => policy.toolId === props.tool.id && policy.conditions.length === 0);
    };

    const currentAction = () => getCallPolicyActionFromPolicies(props.tool.id, callPolicies());

    const argumentNames = () => {
        const params = props.tool.parameters as { properties?: Record<string, unknown> } | undefined;
        return Object.keys(params?.properties ?? {});
    };

    const contextOptions = () => {
        const options: string[] = [];
        if ((externalAgentIds()?.length ?? 0) > 0) options.push(CONTEXT_EXTERNAL_AGENT_ID);
        if ((teams()?.length ?? 0) > 0) options.push(CONTEXT_TEAM_IDS);
        return options;
    };

    const conditionKeyOptions = () => [...argumentNames(), ...contextOptions()];

    const getDefaultConditionKey = () =>
        argumentNames()[0] ?? ((externalAgentIds()?.length ?? 0) > 0 ? CONTEXT_EXTERNAL_AGENT_ID : CONTEXT_TEAM_IDS);

    const onConditionChange = (policy: CallPolicy, index: number, updatedCondition: PolicyCondition) => {
        const newConditions = [...policy.conditions];
        newConditions[index] = updatedCondition;
        updatePolicy({ id: policy.id, conditions: newConditions });
    };

    const onConditionRemove = (policy: CallPolicy, index: number) => {
        const newConditions = policy.conditions.filter(
            (_: unknown, conditionIndex: number) => conditionIndex !== index,
        );
        updatePolicy({ id: policy.id, conditions: newConditions });
    };

    const onConditionAdd = (policy: CallPolicy) => {
        const newConditions: PolicyCondition[] = [
            ...policy.conditions,
            { key: getDefaultConditionKey(), operator: "equal", value: "" },
        ];
        updatePolicy({ id: policy.id, conditions: newConditions });
    };

    const callActionOptions = CALL_POLICY_ACTION_OPTIONS.map((option) => ({
        value: option.value,
        label: option.tooltip,
    }));

    return (
        <div class={styles.container} data-label="Tool call policies">
            <div>
                <h3 class={styles.heading}>Tool call policies</h3>
                <p class={styles.description}>Controls when the tool can be called based on context trust level</p>
            </div>

            <div class={styles.defaultBar}>
                <span class={styles.defaultLabel}>DEFAULT</span>
                <CallPolicyToggle toolId={props.tool.id} policyId={defaultPolicy()?.id} value={currentAction()} />
            </div>

            <For each={conditionalPolicies()}>
                {(policy) => (
                    <PolicyCard onDelete={() => deletePolicy(policy.id)}>
                        <div class={styles.conditions}>
                            <div class={styles.conditionRows}>
                                <For each={policy.conditions}>
                                    {(condition, index) => (
                                        <div class={styles.conditionRow}>
                                            <span class={styles.conditionPrefix}>{index() === 0 ? "If" : ""}</span>
                                            <CallPolicyCondition
                                                condition={condition}
                                                conditionKeyOptions={{
                                                    argumentNames: argumentNames(),
                                                    contextOptions: contextOptions(),
                                                }}
                                                removable={policy.conditions.length > 1}
                                                onChange={(updated) => onConditionChange(policy, index(), updated)}
                                                onRemove={() => onConditionRemove(policy, index())}
                                            />
                                            <Show when={index() < policy.conditions.length - 1}>
                                                <span class={styles.andLabel}>and</span>
                                            </Show>
                                            <Show when={index() === policy.conditions.length - 1}>
                                                <Tooltip content="Add condition">
                                                    <Button
                                                        variant="outline"
                                                        size="icon-small"
                                                        onClick={() => onConditionAdd(policy)}
                                                        aria-label="Add condition"
                                                    >
                                                        <Plus size={14} />
                                                    </Button>
                                                </Tooltip>
                                            </Show>
                                        </div>
                                    )}
                                </For>
                            </div>
                            <div class={styles.actionRow}>
                                <ArrowRight size={16} />
                                <Select
                                    value={policy.action}
                                    onChange={(action) =>
                                        updatePolicy({ id: policy.id, action: action as CallPolicy["action"] })
                                    }
                                    options={callActionOptions}
                                />
                                <Input
                                    placeholder="Reason"
                                    value={policy.reason ?? ""}
                                    onInput={(reason) => updatePolicy({ id: policy.id, reason })}
                                />
                            </div>
                        </div>
                    </PolicyCard>
                )}
            </For>

            <Tooltip
                content={conditionKeyOptions().length === 0 ? "No parameters or context conditions available" : ""}
            >
                <Button
                    variant="outline"
                    class={styles.addButton}
                    disabled={conditionKeyOptions().length === 0}
                    onClick={() => createPolicy({ toolId: props.tool.id, argumentName: getDefaultConditionKey() })}
                >
                    <Plus size={14} /> Add policy
                </Button>
            </Tooltip>
        </div>
    );
}
