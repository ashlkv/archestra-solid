import { CONTEXT_EXTERNAL_AGENT_ID, CONTEXT_TEAM_IDS } from "@shared";
import { type JSX, Match, Show, Switch } from "solid-js";
import { CaseSensitive, Info, X } from "@/components/icons";
import { useOperators, useUniqueExternalAgentIds } from "@/lib/policy.query";
import type { PolicyCondition } from "@/lib/policy.utils";
import { useTeams } from "@/lib/team.query";
import { Input } from "../../primitives/Input";
import { Select } from "../../primitives/Select";
import { Tooltip } from "../../primitives/Tooltip";
import styles from "./CallPolicyCondition.module.css";
import { DestructiveButton } from '../../primitives/DestructiveButton';

type ConditionKeyOptions = {
    argumentNames: string[];
    contextOptions: string[];
};

export function CallPolicyCondition(props: {
    condition: PolicyCondition;
    conditionKeyOptions: ConditionKeyOptions;
    removable: boolean;
    onChange: (condition: PolicyCondition) => void;
    onRemove: () => void;
}): JSX.Element {
    const { data: operators } = useOperators();
    const { data: externalAgentIds } = useUniqueExternalAgentIds();
    const { data: teams } = useTeams();

    const argumentName = () => props.condition.key;
    const operator = () => props.condition.operator;
    const value = () => props.condition.value;

    const onKeyChange = (newKey: string) => {
        let autoValue = "";
        if (newKey === CONTEXT_EXTERNAL_AGENT_ID && (externalAgentIds()?.length ?? 0) === 1) {
            autoValue = externalAgentIds()?.[0].id;
        } else if (newKey === CONTEXT_TEAM_IDS && (teams()?.length ?? 0) === 1) {
            autoValue = teams()?.[0].id;
        }
        let defaultOperator = operator();
        if (newKey === CONTEXT_TEAM_IDS) {
            defaultOperator = "contains";
        } else if (newKey === CONTEXT_EXTERNAL_AGENT_ID) {
            defaultOperator = "equal";
        }
        props.onChange({ key: newKey, operator: defaultOperator, value: autoValue });
    };

    const filteredOperators = () => {
        const all = operators() ?? [];
        if (argumentName() === CONTEXT_EXTERNAL_AGENT_ID) {
            return all.filter((op) => op.value === "equal" || op.value === "notEqual");
        }
        if (argumentName() === CONTEXT_TEAM_IDS) {
            return all.filter((op) => op.value === "contains" || op.value === "notContains");
        }
        return all;
    };

    const keyGroups = () => {
        const groups: { label: string; options: { value: string; label: string }[] }[] = [];
        const contextOpts = props.conditionKeyOptions.contextOptions;
        if (contextOpts.length > 0) {
            groups.push({
                label: "Context",
                options: contextOpts.map((key) => ({
                    value: key,
                    label: key === CONTEXT_EXTERNAL_AGENT_ID ? "External agent" : "Teams",
                })),
            });
        }
        const argNames = props.conditionKeyOptions.argumentNames;
        if (argNames.length > 0) {
            groups.push({
                label: "Parameters",
                options: argNames.map((name) => ({ value: name, label: name })),
            });
        }
        return groups;
    };

    const isContextKey = () => argumentName() === CONTEXT_EXTERNAL_AGENT_ID || argumentName() === CONTEXT_TEAM_IDS;

    const showCaseSensitiveHint = () => !isContextKey();

    return (
        <div class={styles.row} data-label="Call policy condition">
            <Select value={argumentName()} onChange={onKeyChange} groups={keyGroups()} placeholder="Parameter" name="key" size="small" />
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
                <Match when={argumentName() === CONTEXT_EXTERNAL_AGENT_ID && (externalAgentIds()?.length ?? 0) === 1}>
                    <div class={styles.single}>
                        <span class={styles.truncate}>{externalAgentIds()?.[0].displayName}</span>
                        <Tooltip content="Only one external agent available">
                            <Info size={14} />
                        </Tooltip>
                    </div>
                </Match>
                <Match when={argumentName() === CONTEXT_EXTERNAL_AGENT_ID && (externalAgentIds()?.length ?? 0) > 1}>
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
                <Match when={argumentName() === CONTEXT_TEAM_IDS && (teams()?.length ?? 0) === 1}>
                    <div class={styles.single}>
                        <span class={styles.truncate}>{teams()?.[0].name}</span>
                        <Tooltip content="Only one team available">
                            <Info size={14} />
                        </Tooltip>
                    </div>
                </Match>
                <Match when={argumentName() === CONTEXT_TEAM_IDS && (teams()?.length ?? 0) > 1}>
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
            {/*<Show when={showCaseSensitiveHint()}>
                <Tooltip content="Matching is case-sensitive">
                    <CaseSensitive size={16} />
                </Tooltip>
            </Show>*/}
            <Show when={props.removable}>
                <DestructiveButton
                    variant="ghost"
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
