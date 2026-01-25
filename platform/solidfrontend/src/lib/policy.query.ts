import { revalidate } from "@solidjs/router";
import { createQuery, createSubmission, getAuthHeaders } from "@/lib/api";
import { archestraApiSdk } from "@shared";
import type { CallPolicy, ResultPolicy } from "@/types";

export const useToolCallPolicies = createQuery({
    queryKey: "fetch-tool-invocation-policies",
    callback: () => archestraApiSdk.getToolInvocationPolicies({ headers: getAuthHeaders() }),
});

type CallPolicyUpdate = Pick<CallPolicy, 'id' | 'action' | 'conditions' | 'reason'>

// Solid Router's action() must be defined at module level (not inside components/hooks).
// Unlike TanStack Query where each useMutation has isolated state, Solid's useSubmission
// tracks a shared action - so all components using it see the same pending/error state.
// The filter in useSaveCallPolicy below isolates each component's submission tracking.
const saveCallPolicy = createSubmission({
    callback: async ({toolId, policy: { id, action, conditions, reason }}: { toolId: string, policy: CallPolicyUpdate }) => {
        if (id) {
            return archestraApiSdk.updateToolInvocationPolicy({
                headers: getAuthHeaders(),
                path: { id },
                body: { action, conditions, reason },
            });
        } else {
            return archestraApiSdk.createToolInvocationPolicy({
                headers: getAuthHeaders(),
                body: { toolId, action, conditions, reason },
            });
        }
    },
    onSuccess: () => revalidate("fetch-tool-invocation-policies"),
})

export function useSaveCallPolicy(policyId: string) {
    return saveCallPolicy(([{ policy}]) => policy?.id === policyId)
}

export const useResultPolicies = createQuery({
    queryKey: "fetch-result-policies",
    callback: () => archestraApiSdk.getTrustedDataPolicies({ headers: getAuthHeaders() }),
});

type ResultPolicyUpdate = Pick<ResultPolicy, 'id' | 'action' | 'conditions'>

const saveResultPolicy = createSubmission({
    callback: async ({toolId, policy: { id, action, conditions }}: { toolId: string; policy: ResultPolicyUpdate }) => {
        if (id) {
            return archestraApiSdk.updateTrustedDataPolicy({
                headers: getAuthHeaders(),
                path: { id },
                body: { action },
            });
        } else {
            return archestraApiSdk.createTrustedDataPolicy({
                headers: getAuthHeaders(),
                body: { toolId, action, conditions },
            });
        }
    },
    onSuccess: () => revalidate("fetch-result-policies"),
})

export function useSaveResultPolicy(policyId: string) {
    // Filter ensures each component only tracks its own submission state,
    // not submissions from other components using the same shared action.
    return saveResultPolicy(([{policy}]) => policy?.id === policyId);
}
