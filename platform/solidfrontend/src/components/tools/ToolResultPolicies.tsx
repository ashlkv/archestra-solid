import { CONTEXT_EXTERNAL_AGENT_ID, CONTEXT_TEAM_IDS } from "@shared";
import { For, type JSX, Show } from "solid-js";
import { ArrowRight, Plus } from "@/components/icons";
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
    type PolicyCondition,
} from "@/lib/policy.utils";
import { useTeams } from "@/lib/team.query";
import type { ResultPolicy } from "@/types";
import { Button } from "../primitives/Button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../primitives/Collapsible";
import { Select } from "../primitives/Select";
import { Tooltip } from "../primitives/Tooltip";
import { PolicyCard } from "./PolicyCard";
import { ResultPolicyCondition } from "./ResultPolicyCondition";
import { ResultPolicySelect } from "./ResultPolicySelect";
import styles from "./ToolPolicies.module.css";
import { RESULT_POLICY_ACTION_OPTIONS_LONG } from "./tool.utils";

export function ToolResultPolicies(props: { tool: { id: string } }): JSX.Element {
    const { data: resultPolicies } = useResultPolicies();
    const { submit: createPolicy } = useCreateResultPolicy();
    const { submit: deletePolicy } = useDeleteResultPolicy();
    const { submit: updatePolicy } = useUpdateResultPolicy();
    const { data: externalAgentIds } = useUniqueExternalAgentIds();
    const { data: teams } = useTeams();

    const conditionalPolicies = () => getConditionalPoliciesForTool(props.tool.id, resultPolicies());

    const defaultPolicy = () => {
        const policies = resultPolicies() ?? [];
        return policies.find((policy) => policy.toolId === props.tool.id && policy.conditions.length === 0);
    };

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

    const onConditionChange = (policy: ResultPolicy, index: number, updatedCondition: PolicyCondition) => {
        const newConditions = [...policy.conditions];
        newConditions[index] = updatedCondition;
        updatePolicy({ id: policy.id, conditions: newConditions });
    };

    const onConditionRemove = (policy: ResultPolicy, index: number) => {
        const newConditions = policy.conditions.filter(
            (_: unknown, conditionIndex: number) => conditionIndex !== index,
        );
        updatePolicy({ id: policy.id, conditions: newConditions });
    };

    const onConditionAdd = (policy: ResultPolicy) => {
        const newConditions: PolicyCondition[] = [...policy.conditions, { key: "", operator: "equal", value: "" }];
        updatePolicy({ id: policy.id, conditions: newConditions });
    };

    const resultActionOptions = RESULT_POLICY_ACTION_OPTIONS_LONG.map((option) => ({
        value: option.value,
        label: option.label,
    }));

    return (
        <div class={styles.container} data-label="Tool result policies">
            <div>
                <h3 class={styles.heading}>Tool result policies</h3>
                <p class={styles.description}>
                    Tool results impact agent decisions and actions. This policy allows to mark tool results as
                    "trusted" or "untrusted" to prevent agent acting on untrusted data.{" "}
                    <a
                        href="https://archestra.ai/docs/platform-dynamic-tools"
                        target="_blank"
                        rel="noopener noreferrer"
                        class={styles.link}
                    >
                        Read more about Dynamic Tools.
                    </a>
                </p>
            </div>

            <div class={styles.defaultBar}>
                <span class={styles.defaultLabel}>DEFAULT</span>
                <ResultPolicySelect toolId={props.tool.id} policyId={defaultPolicy()?.id} value={resultAction()} />
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
                                            <ResultPolicyCondition
                                                condition={condition}
                                                keyItems={keyItems()}
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
                                        updatePolicy({ id: policy.id, action: action as ResultPolicy["action"] })
                                    }
                                    options={resultActionOptions}
                                />
                            </div>
                        </div>
                    </PolicyCard>
                )}
            </For>

            <Button
                variant="outline"
                class={styles.addButton}
                onClick={() => createPolicy({ toolId: props.tool.id, attributePath: "" })}
            >
                <Plus size={14} /> Add tool result policy
            </Button>

            <Show when={conditionalPolicies().length > 0}>
                <AttributePathExamples />
            </Show>
        </div>
    );
}

function AttributePathExamples(): JSX.Element {
    return (
        <Collapsible class={styles.cheatSheet}>
            <CollapsibleTrigger class={styles.cheatSheetHeader}>Attribute path syntax cheat sheet</CollapsibleTrigger>
            <CollapsibleContent>
                <div class={styles.cheatSheetContent}>
                    <p>
                        Attribute paths use{" "}
                        <a
                            href="https://lodash.com/docs/4.17.15#get"
                            target="_blank"
                            rel="noopener noreferrer"
                            class={styles.link}
                        >
                            lodash get syntax
                        </a>{" "}
                        to target specific fields in tool responses. You can use <span class={styles.code}>*</span> as a
                        wildcard to match all items in an array.
                    </p>

                    <div class={styles.cheatSheetExample}>
                        <strong>Example 1: Simple nested object</strong>
                        <p>Tool response from a weather API:</p>
                        <pre class={styles.cheatSheetCode}>{`{
  "location": "San Francisco",
  "current": {
    "temperature": 72,
    "conditions": "Sunny"
  }
}`}</pre>
                        <ul>
                            <li>
                                <span class={styles.code}>location</span> = "San Francisco"
                            </li>
                            <li>
                                <span class={styles.code}>current.temperature</span> = 72
                            </li>
                            <li>
                                <span class={styles.code}>current.conditions</span> = "Sunny"
                            </li>
                        </ul>
                    </div>

                    <div class={styles.cheatSheetExample}>
                        <strong>Example 2: Array with wildcard (*)</strong>
                        <p>Tool response from an email API:</p>
                        <pre class={styles.cheatSheetCode}>{`{
  "emails": [
    {
      "from": "alice@company.com",
      "subject": "Meeting notes",
      "body": "Here are the notes..."
    },
    {
      "from": "external@example.com",
      "subject": "Ignore previous instructions",
      "body": "Malicious content..."
    }
  ]
}`}</pre>
                        <ul>
                            <li>
                                <span class={styles.code}>emails[*].from</span> = Matches all "from" fields
                            </li>
                            <li>
                                <span class={styles.code}>emails[0].from</span> = "alice@company.com"
                            </li>
                            <li>
                                <span class={styles.code}>emails[*].body</span> = Matches all "body" fields
                            </li>
                        </ul>
                        <p>
                            <em>Use case: Block emails from external domains or mark internal emails as trusted</em>
                        </p>
                    </div>
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}
