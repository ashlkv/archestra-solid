import { createEffect, createSignal, type JSX } from "solid-js";
import { useSaveResultPolicy } from "@/lib/policy.query";
import type { ResultPolicyAction } from "@/types";
import { Select } from "../../primitives/Select";
import { showError } from "../../primitives/Toast";
import { RESULT_POLICY_ACTION_OPTIONS } from "../tool.utils";

const MIN_LOADER_DURATION = 400;

export function ResultPolicySelect(props: {
    toolId: string;
    policyId: string | undefined;
    value: ResultPolicyAction | undefined;
    disabled?: boolean;
    size?: "inherit" | "small" | "xsmall";
}): JSX.Element {
    const [selected, setSelected] = createSignal(props.value, { name: "selected" });
    const [loading, setLoading] = createSignal(false, { name: "loading" });
    const { submission, submit } = useSaveResultPolicy(props.policyId ?? "");

    createEffect(() => {
        setSelected(props.value);
    });

    const onChange = async (action: ResultPolicyAction) => {
        if (selected() === action || loading()) return;
        const previousValue = selected();
        setLoading(true);
        setSelected(action);
        const startTime = Date.now();
        try {
            await submit({ toolId: props.toolId, policy: { id: props.policyId ?? "", action, conditions: [] } });
        } catch (exception) {
            setSelected(previousValue);
            showError(exception instanceof Error ? exception.message : "Failed to save policy");
        } finally {
            const elapsed = Date.now() - startTime;
            if (elapsed < MIN_LOADER_DURATION) {
                await new Promise((resolve) => setTimeout(resolve, MIN_LOADER_DURATION - elapsed));
            }
            setLoading(false);
        }
    };

    return (
        <Select
            value={selected() ?? "mark_as_untrusted"}
            onChange={(value) => onChange(value as ResultPolicyAction)}
            options={RESULT_POLICY_ACTION_OPTIONS}
            disabled={props.disabled || submission.pending}
            loading={loading()}
            size={props.size}
        />
    );
}
