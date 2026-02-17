import { CONTEXT_EXTERNAL_AGENT_ID, CONTEXT_TEAM_IDS } from "@shared";
import { type JSX, Match, Show, Switch } from "solid-js";
import { Info, X } from "@/components/icons";
import { useOperators, useUniqueExternalAgentIds } from "@/lib/policy.query";
import type { PolicyCondition } from "@/lib/policy.utils";
import { useTeams } from "@/lib/team.query";
import { ComboboxInput } from "../../primitives/ComboboxInput";
import { Input } from "../../primitives/Input";
import { Select } from "../../primitives/Select";
import { Tooltip } from "../../primitives/Tooltip";
import { DestructiveButton } from "../../primitives/DestructiveButton";
import styles from "./ResultPolicyCondition.module.css";

type KeyItem = {
    value: string;
    label: string;
};

export function ResultPolicyCondition(props: {
    condition: PolicyCondition;
    keyItems: KeyItem[];
    removable: boolean;
    onChange: (condition: PolicyCondition) => void;
    onRemove: () => void;
}): JSX.Element {
    const { data: operators } = useOperators();
    const { data: externalAgentIds } = useUniqueExternalAgentIds();
    const { data: teams } = useTeams();

    const attributePath = () => props.condition.key;
    const operator = () => props.condition.operator;
    const value = () => props.condition.value;

    const onKeyChange = (newAttributePath: string) => {
        let autoValue = "";
        if (newAttributePath === CONTEXT_EXTERNAL_AGENT_ID && (externalAgentIds()?.length ?? 0) === 1) {
            autoValue = externalAgentIds()?.[0].id;
        } else if (newAttributePath === CONTEXT_TEAM_IDS && (teams()?.length ?? 0) === 1) {
            autoValue = teams()?.[0].id;
        }
        let defaultOperator = operator();
        if (newAttributePath === CONTEXT_TEAM_IDS) {
            defaultOperator = "contains";
        } else if (newAttributePath === CONTEXT_EXTERNAL_AGENT_ID) {
            defaultOperator = "equal";
        }
        props.onChange({ key: newAttributePath, operator: defaultOperator, value: autoValue });
    };

    const filteredOperators = () => {
        const all = operators() ?? [];
        if (attributePath() === CONTEXT_EXTERNAL_AGENT_ID) {
            return all.filter((op) => op.value === "equal" || op.value === "notEqual");
        }
        if (attributePath() === CONTEXT_TEAM_IDS) {
            return all.filter((op) => op.value === "contains" || op.value === "notContains");
        }
        return all;
    };

    const isContextKey = () => attributePath() === CONTEXT_EXTERNAL_AGENT_ID || attributePath() === CONTEXT_TEAM_IDS;

    const showInvalidPath = () => !isContextKey() && attributePath().length > 0 && !isValidPathSyntax(attributePath());

    return (
        <div class={styles.row} data-label="Result policy condition">
            <div class={styles.key}>
                <ComboboxInput
                    value={attributePath()}
                    onChange={onKeyChange}
                    options={props.keyItems}
                    placeholder="Attribute path..."
                    inputPlaceholder="Type attribute path..."
                    size="small"
                />
                <Show when={showInvalidPath()}>
                    <span class={styles.invalidPath}>Invalid path</span>
                </Show>
            </div>
            <Select
                value={operator()}
                onChange={(newOperator) =>
                    props.onChange({ ...props.condition, operator: newOperator as PolicyCondition["operator"] })
                }
                options={filteredOperators().map((op) => ({ value: op.value, label: op.label }))}
                placeholder="Operator"
                name="operator"
                size="small"
            />
            <Switch>
                <Match when={attributePath() === CONTEXT_EXTERNAL_AGENT_ID && (externalAgentIds()?.length ?? 0) === 1}>
                    <div class={styles.single}>
                        <span class={styles.truncate}>{externalAgentIds()?.[0].displayName}</span>
                        <Tooltip content="Only one external agent available">
                            <Info size={14} />
                        </Tooltip>
                    </div>
                </Match>
                <Match when={attributePath() === CONTEXT_EXTERNAL_AGENT_ID && (externalAgentIds()?.length ?? 0) > 1}>
                    <Select
                        value={value() || ""}
                        onChange={(newValue) => props.onChange({ ...props.condition, value: newValue })}
                        options={(externalAgentIds() ?? []).map((agent) => ({
                            value: agent.id,
                            label: agent.displayName,
                        }))}
                        placeholder="Select agent"
                        name="value"
                        size="small"
                    />
                </Match>
                <Match when={attributePath() === CONTEXT_TEAM_IDS && (teams()?.length ?? 0) === 1}>
                    <div class={styles.single}>
                        <span class={styles.truncate}>{teams()?.[0].name}</span>
                        <Tooltip content="Only one team available">
                            <Info size={14} />
                        </Tooltip>
                    </div>
                </Match>
                <Match when={attributePath() === CONTEXT_TEAM_IDS && (teams()?.length ?? 0) > 1}>
                    <Select
                        value={value() || ""}
                        onChange={(newValue) => props.onChange({ ...props.condition, value: newValue })}
                        options={(teams() ?? []).map((team) => ({ value: team.id, label: team.name }))}
                        placeholder="Select team"
                        name="value"
                        size="small"
                    />
                </Match>
                <Match when={!isContextKey()}>
                    <Input
                        placeholder="Value"
                        value={value()}
                        onInput={(newValue) => props.onChange({ ...props.condition, value: newValue })}
                        size="small"
                    />
                </Match>
            </Switch>
            <Show when={props.removable}>
                <DestructiveButton
                    size="icon"
                    tooltip="Remove condition"
                    onClick={props.onRemove}
                    aria-label="Remove condition"
                >
                    <X size={14} />
                </DestructiveButton>
            </Show>
        </div>
    );
}

function isValidPathSyntax(path: string): boolean {
    if (!path) return false;
    const segments = path.split(".");
    return segments.every((segment) => segment.length > 0);
}
