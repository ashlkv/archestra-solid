import { CONTEXT_EXTERNAL_AGENT_ID, CONTEXT_TEAM_IDS } from "@shared";
import { For, type JSX, Show } from "solid-js";
import { Plus } from "@/components/icons";
import {
    useCreateResultPolicy,
    useDeleteResultPolicy,
    useResultPolicies,
    useUniqueExternalAgentIds,
    useUpdateResultPolicy,
} from "@/lib/policy.query";
import {
    getConditionalPoliciesForTool,
    getResultPolicyActionFromPolicies,
} from "@/lib/policy.utils";
import { useTeams } from "@/lib/team.query";
import { Button } from "../../primitives/Button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../primitives/Collapsible";
import { CustomResultPolicy } from "./CustomResultPolicy";
import { ResultPolicySelect } from "./ResultPolicySelect";
import styles from "./ResultPolicies.module.css";
import { RESULT_POLICY_ACTION_OPTIONS_LONG } from "../tool.utils";

export function ResultPolicies(props: { tool: { id: string } }): JSX.Element {
    const { data: resultPolicies } = useResultPolicies();
    const { submit: createPolicy } = useCreateResultPolicy();
    const { submit: deletePolicy } = useDeleteResultPolicy();
    const { submit: updatePolicy } = useUpdateResultPolicy();
    const { data: externalAgentIds } = useUniqueExternalAgentIds();
    const { data: teams } = useTeams();

    const conditionalPolicies = () => getConditionalPoliciesForTool(props.tool.id, resultPolicies());

    const defaultPolicy = () =>
        (resultPolicies() ?? []).find((policy) => policy.toolId === props.tool.id && policy.conditions.length === 0);

    const resultAction = () => getResultPolicyActionFromPolicies(props.tool.id, resultPolicies());

    const contextOptions = () => {
        const options: string[] = [];
        if ((externalAgentIds()?.length ?? 0) > 0) options.push(CONTEXT_EXTERNAL_AGENT_ID);
        if ((teams()?.length ?? 0) > 0) options.push(CONTEXT_TEAM_IDS);
        return options;
    };

    const keyItems = () =>
        contextOptions().map((key) => ({
            value: key,
            label: key === CONTEXT_EXTERNAL_AGENT_ID ? "External agent" : "Teams",
        }));

    const resultActionOptions = RESULT_POLICY_ACTION_OPTIONS_LONG.map((option) => ({
        value: option.value,
        label: option.label,
    }));

    return (
        <div class={styles.policies}>
            <For each={conditionalPolicies()}>
                {(policy) => (
                    <CustomResultPolicy
                        conditions={policy.conditions}
                        action={policy.action}
                        keyItems={keyItems()}
                        resultActionOptions={resultActionOptions}
                        onDelete={() => deletePolicy(policy.id)}
                        onConditionsChange={(conditions) => updatePolicy({ id: policy.id, conditions })}
                        onActionChange={(action) => updatePolicy({ id: policy.id, action })}
                        class={styles.custom}
                    />
                )}
            </For>
            <div class={styles.default}>
                Default result policy:
                <ResultPolicySelect toolId={props.tool.id} policyId={defaultPolicy()?.id} value={resultAction()} />
                <Button
                    class={styles.add}
                    onClick={() => createPolicy({ toolId: props.tool.id, attributePath: "" })}
                >
                    <Plus size={14} /> Add custom
                </Button>
            </div>
        </div>
    );
}
