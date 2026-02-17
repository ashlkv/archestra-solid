import { CONTEXT_EXTERNAL_AGENT_ID, CONTEXT_TEAM_IDS } from "@shared";
import { For, type JSX } from "solid-js";
import { Plus, ShieldCheck } from "@/components/icons";
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
} from "@/lib/policy.utils";
import { useTeams } from "@/lib/team.query";
import { Button } from "../../primitives/Button";
import { CallPolicyToggle } from "./CallPolicyToggle";
import { CustomCallPolicy } from "./CustomCallPolicy";
import styles from "./CallPolicies.module.css";
import { CALL_POLICY_ACTION_OPTIONS } from "../tool.utils";

type ToolForPolicies = {
    id: string;
    parameters?: { [key: string]: unknown };
};

export function CallPolicies(props: { tool: ToolForPolicies }): JSX.Element {
    const { data: callPolicies } = useToolCallPolicies();
    const { submit: createPolicy } = useCreateCallPolicy();
    const { submit: deletePolicy } = useDeleteCallPolicy();
    const { submit: updatePolicy } = useUpdateCallPolicy();
    const { data: externalAgentIds } = useUniqueExternalAgentIds();
    const { data: teams } = useTeams();

    const conditionalPolicies = () => getConditionalPoliciesForTool(props.tool.id, callPolicies());

    const defaultPolicy = () =>
        (callPolicies() ?? []).find((policy) => policy.toolId === props.tool.id && policy.conditions.length === 0);

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

    const getDefaultConditionKey = () => argumentNames()[0] ?? contextOptions()[0];

    const callActionOptions = CALL_POLICY_ACTION_OPTIONS.map((option) => ({
        value: option.value,
        label: option.tooltip,
    }));

    return (
        <div class={styles.policies}>
            <ShieldCheck class={styles.icon} size={28} />
            <For each={conditionalPolicies()}>
                {(policy) => (
                    <CustomCallPolicy
                        conditions={policy.conditions}
                        action={policy.action}
                        reason={policy.reason ?? undefined}
                        conditionKeyOptions={{ argumentNames: argumentNames(), contextOptions: contextOptions() }}
                        callActionOptions={callActionOptions}
                        onDelete={() => deletePolicy(policy.id)}
                        onConditionsChange={(conditions) => updatePolicy({ id: policy.id, conditions })}
                        onActionChange={(action) => updatePolicy({ id: policy.id, action })}
                        onReasonChange={(reason) => updatePolicy({ id: policy.id, reason })}
                        class={styles.custom}
                    />
                )}
            </For>
            <div class={styles["default"]}>
                Default call policy:
                <CallPolicyToggle toolId={props.tool.id} policyId={defaultPolicy()?.id} value={currentAction()} />
                <Button
                    class={styles.add}
                    disabled={conditionKeyOptions().length === 0}
                    onClick={() => createPolicy({ toolId: props.tool.id, argumentName: getDefaultConditionKey() })}
                >
                    <Plus size={14} /> Add custom
                </Button>
            </div>
        </div>
    );
}
