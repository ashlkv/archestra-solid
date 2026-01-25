import { type CallPolicy, type ResultPolicy } from '~/types';

type CallPolicyAction = CallPolicy["action"]
type ResultPolicyAction = ResultPolicy["action"]

export const CALL_POLICY_ACTION_OPTIONS: {
    value: CallPolicyAction;
    label: string;
    tooltip: string;
}[] = [
    { value: "allow_when_context_is_untrusted", label: "Allow", tooltip: "Allow always" },
    { value: "block_when_context_is_untrusted", label: "Trusted", tooltip: "Allow in trusted context" },
    { value: "block_always", label: "Block", tooltip: "Block always" },
];

export const RESULT_POLICY_ACTION_OPTIONS: {
    value: ResultPolicyAction;
    label: string;
}[] = [
    { value: "mark_as_trusted", label: "Trusted" },
    { value: "mark_as_untrusted", label: "Untrusted" },
    { value: "sanitize_with_dual_llm", label: "Dual LLM" },
    { value: "block_always", label: "Blocked" },
];

// Longer labels for the policy modal
export const RESULT_POLICY_ACTION_OPTIONS_LONG: {
    value: ResultPolicyAction;
    label: string;
}[] = [
    { value: "mark_as_trusted", label: "Mark as trusted" },
    { value: "mark_as_untrusted", label: "Mark as untrusted" },
    { value: "sanitize_with_dual_llm", label: "Sanitize with Dual LLM" },
    { value: "block_always", label: "Block" },
];
