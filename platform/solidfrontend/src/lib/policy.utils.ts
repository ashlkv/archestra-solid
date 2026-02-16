import type { CallPolicy, ResultPolicy, ResultPolicyAction } from "@/types";

export type PolicyCondition = {
    key: string;
    operator: "equal" | "notEqual" | "contains" | "notContains" | "startsWith" | "endsWith" | "regex";
    value: string;
};

type CallPolicyAction = CallPolicy["action"];

export function getCallPolicyActionFromPolicies(toolId: string, policies: CallPolicy[] | undefined): CallPolicyAction {
    if (!policies) return "block_when_context_is_untrusted";
    const defaultPolicy = policies.find((policy) => policy.toolId === toolId && policy.conditions.length === 0);
    if (defaultPolicy) {
        const callAction = defaultPolicy.action as CallPolicyAction;
        if (
            callAction === "allow_when_context_is_untrusted" ||
            callAction === "block_when_context_is_untrusted" ||
            callAction === "block_always"
        ) {
            return callAction;
        }
    }
    return "block_when_context_is_untrusted";
}

export function getResultPolicyActionFromPolicies(
    toolId: string,
    policies: ResultPolicy[] | undefined,
): ResultPolicyAction {
    if (!policies) return "mark_as_untrusted";
    const defaultPolicy = policies.find((policy) => policy.toolId === toolId && policy.conditions.length === 0);
    if (defaultPolicy) return defaultPolicy.action;
    return "mark_as_untrusted";
}

export function getConditionalPoliciesForTool<T extends { toolId: string; conditions: unknown[] }>(
    toolId: string,
    policies: T[] | undefined,
): T[] {
    if (!policies) return [];
    return policies.filter((policy) => policy.toolId === toolId && policy.conditions.length > 0);
}

export function getDefaultPolicyForTool<T extends { toolId: string; conditions: unknown[] }>(
    toolId: string,
    policies: T[] | undefined,
): T | undefined {
    if (!policies) return undefined;
    return policies.find((policy) => policy.toolId === toolId && policy.conditions.length === 0);
}
