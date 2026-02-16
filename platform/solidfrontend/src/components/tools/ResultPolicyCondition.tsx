import { CONTEXT_EXTERNAL_AGENT_ID, CONTEXT_TEAM_IDS } from "@shared";
import { type JSX, Show } from "solid-js";
import { CaseSensitive, Info, X } from "@/components/icons";
import { useOperators, useUniqueExternalAgentIds } from "@/lib/policy.query";
import type { PolicyCondition } from "@/lib/policy.utils";
import { useTeams } from "@/lib/team.query";
import { Button } from "../primitives/Button";
import { Input } from "../primitives/Input";
import { Select } from "../primitives/Select";
import { Tooltip } from "../primitives/Tooltip";
import styles from "./PolicyCondition.module.css";

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

    const showCaseSensitiveHint = () => !isContextKey();

    // Combine context key items with the free-form attribute path input option
    const selectOptions = () => {
        const options = [...props.keyItems];
        // If the current value is a custom attribute path not in the list, add it
        const currentPath = attributePath();
        if (currentPath && !options.some((opt) => opt.value === currentPath) && !isContextKey()) {
            options.push({ value: currentPath, label: currentPath });
        }
        return options;
    };

    return (
        <div class={styles.row} data-label="Result policy condition">
            <div class={styles.grid}>
                <div class={styles.keyColumn}>
                    <Show when={props.keyItems.length > 0 || isContextKey()}>
                        <Select
                            value={attributePath()}
                            onChange={onKeyChange}
                            options={selectOptions()}
                            placeholder="Attribute path"
                        />
                    </Show>
                    <Show
                        when={
                            !isContextKey() &&
                            (props.keyItems.length === 0 ||
                                !props.keyItems.some((item) => item.value === attributePath()))
                        }
                    >
                        <Input
                            placeholder="Attribute path (e.g. emails[*].from)"
                            value={attributePath()}
                            onInput={(newPath) => onKeyChange(newPath)}
                        />
                    </Show>
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
                />
                <Show when={attributePath() === CONTEXT_EXTERNAL_AGENT_ID}>
                    <Show when={(externalAgentIds()?.length ?? 0) === 1}>
                        <div class={styles.singleValue}>
                            <span class={styles.truncate}>{externalAgentIds()?.[0].displayName}</span>
                            <Tooltip content="Only one external agent available">
                                <Info size={14} />
                            </Tooltip>
                        </div>
                    </Show>
                    <Show when={(externalAgentIds()?.length ?? 0) > 1}>
                        <Select
                            value={value() || ""}
                            onChange={(newValue) => props.onChange({ ...props.condition, value: newValue })}
                            options={(externalAgentIds() ?? []).map((agent) => ({
                                value: agent.id,
                                label: agent.displayName,
                            }))}
                            placeholder="Select agent"
                        />
                    </Show>
                </Show>
                <Show when={attributePath() === CONTEXT_TEAM_IDS}>
                    <Show when={(teams()?.length ?? 0) === 1}>
                        <div class={styles.singleValue}>
                            <span class={styles.truncate}>{teams()?.[0].name}</span>
                            <Tooltip content="Only one team available">
                                <Info size={14} />
                            </Tooltip>
                        </div>
                    </Show>
                    <Show when={(teams()?.length ?? 0) > 1}>
                        <Select
                            value={value() || ""}
                            onChange={(newValue) => props.onChange({ ...props.condition, value: newValue })}
                            options={(teams() ?? []).map((team) => ({ value: team.id, label: team.name }))}
                            placeholder="Select team"
                        />
                    </Show>
                </Show>
                <Show when={!isContextKey()}>
                    <Input
                        placeholder="Value"
                        value={value()}
                        onInput={(newValue) => props.onChange({ ...props.condition, value: newValue })}
                    />
                </Show>
            </div>
            <Show when={showCaseSensitiveHint()}>
                <Tooltip content="Matching is case-sensitive">
                    <CaseSensitive size={16} />
                </Tooltip>
            </Show>
            <Show when={props.removable}>
                <Button
                    variant="ghost"
                    size="icon-xsmall"
                    onClick={props.onRemove}
                    aria-label="Remove condition"
                    class={styles.removeButton}
                >
                    <X size={14} />
                </Button>
            </Show>
        </div>
    );
}

function isValidPathSyntax(path: string): boolean {
    // Simple validation: no empty segments like "a..b", and valid bracket syntax
    if (!path) return false;
    const segments = path.split(".");
    return segments.every((segment) => segment.length > 0);
}
