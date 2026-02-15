import type { Accessor } from "solid-js";
import { useBulkSaveCallPolicy, useBulkSaveResultPolicy } from "@/lib/policy.query";
import type { CallPolicy, ResultPolicy } from "@/types";
import { Select } from "../primitives/Select";
import styles from "./GroupPolicyBar.module.css";
import { CALL_POLICY_ACTION_OPTIONS, RESULT_POLICY_ACTION_OPTIONS_LONG } from "./tool.utils";

type CallPolicyAction = CallPolicy["action"];
type ResultPolicyAction = ResultPolicy["action"];

export function GroupPolicyBar(props: {
    selectedIds: Accessor<Set<string>>;
    callPolicyDictionary: Accessor<Record<string, { id: string; action: CallPolicyAction }>>;
    resultPolicyDictionary: Accessor<Record<string, { id: string; action: ResultPolicyAction }>>;
    onClear: () => void;
    disabled?: boolean;
}) {
    const bulkCallPolicy = useBulkSaveCallPolicy();
    const bulkResultPolicy = useBulkSaveResultPolicy();

    function applyCallPolicy(action: string) {
        const ids = props.selectedIds();
        const dict = props.callPolicyDictionary();
        for (const toolId of ids) {
            const existing = dict[toolId];
            bulkCallPolicy.submit({
                toolId,
                policy: {
                    id: existing?.id ?? "",
                    action: action as CallPolicyAction,
                    conditions: [],
                    reason: null,
                },
            });
        }
    }

    function applyResultPolicy(action: string) {
        const ids = props.selectedIds();
        const dict = props.resultPolicyDictionary();
        for (const toolId of ids) {
            const existing = dict[toolId];
            bulkResultPolicy.submit({
                toolId,
                policy: {
                    id: existing?.id ?? "",
                    action: action as ResultPolicyAction,
                    conditions: [],
                },
            });
        }
    }

    const callOptions = CALL_POLICY_ACTION_OPTIONS.map((o) => ({ value: o.value, label: o.tooltip }));
    const resultOptions = RESULT_POLICY_ACTION_OPTIONS_LONG.map((o) => ({ value: o.value, label: o.label }));

    const disabled = () => props.disabled ?? false;
    const count = () => props.selectedIds().size;

    return (
        <div class={`${styles.bar} ${disabled() ? styles.disabled : ""}`}>
            <span class={styles.count}>{count()}</span>
            <span class={styles.label}>tools selected</span>

            <div class={styles.group}>
                <span class={styles.label}>Call Policy:</span>
                <Select
                    value=""
                    onChange={applyCallPolicy}
                    options={callOptions}
                    placeholder="Select action"
                    disabled={disabled()}
                />
            </div>

            <div class={styles.group}>
                <span class={styles.label}>Results are:</span>
                <Select
                    value=""
                    onChange={applyResultPolicy}
                    options={resultOptions}
                    placeholder="Select action"
                    disabled={disabled()}
                />
            </div>

            <div class={styles.spacer} />

            <button type="button" class={styles.clear} onClick={props.onClear} disabled={disabled()}>
                Clear selection
            </button>
        </div>
    );
}
