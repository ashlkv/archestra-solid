import { archestraApiSdk } from "@shared";
import { revalidate } from "@solidjs/router";
import { createQuery, createSubmission, getAuthHeaders } from "@/lib/api";
import type { PolicyCondition } from "@/lib/policy.utils";
import type { CallPolicy, ResultPolicy } from "@/types";

export const useToolCallPolicies = createQuery({
    queryKey: "fetch-tool-invocation-policies",
    callback: () => archestraApiSdk.getToolInvocationPolicies({ headers: getAuthHeaders() }),
});

export const useOperators = createQuery({
    queryKey: "fetch-operators",
    callback: () => archestraApiSdk.getOperators({ headers: getAuthHeaders() }),
});

export const useUniqueExternalAgentIds = createQuery({
    queryKey: "fetch-unique-external-agent-ids",
    callback: () => archestraApiSdk.getUniqueExternalAgentIds({ headers: getAuthHeaders() }),
});

export const usePolicyConfigSubagentPrompt = createQuery({
    queryKey: "fetch-policy-config-subagent-prompt",
    callback: async () => {
        const response = await archestraApiSdk.getPolicyConfigSubagentPrompt({ headers: getAuthHeaders() });
        return { data: response.data?.promptTemplate ?? "", error: response.error };
    },
});

type CallPolicyUpdate = Pick<CallPolicy, "id" | "action" | "conditions" | "reason">;

// Solid Router's action() must be defined at module level (not inside components/hooks).
// Unlike TanStack Query where each useMutation has isolated state, Solid's useSubmission
// tracks a shared action - so all components using it see the same pending/error state.
// The filter in useSaveCallPolicy below isolates each component's submission tracking.
const saveCallPolicy = createSubmission({
    callback: async ({
        toolId,
        policy: { id, action, conditions, reason },
    }: {
        toolId: string;
        policy: CallPolicyUpdate;
    }) => {
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
});

export function useSaveCallPolicy(policyId: string | undefined) {
    return saveCallPolicy(([{ policy }]) => policy?.id === policyId);
}

export function useBulkSaveCallPolicy() {
    return saveCallPolicy();
}

const createCallPolicy = createSubmission({
    callback: async ({ toolId, argumentName }: { toolId: string; argumentName: string }) => {
        return archestraApiSdk.createToolInvocationPolicy({
            headers: getAuthHeaders(),
            body: {
                toolId,
                conditions: [{ key: argumentName, operator: "equal", value: "" }],
                action: "allow_when_context_is_untrusted",
                reason: null,
            },
        });
    },
    onSuccess: () => revalidate("fetch-tool-invocation-policies"),
});

export function useCreateCallPolicy() {
    return createCallPolicy();
}

const updateCallPolicy = createSubmission({
    callback: async (update: {
        id: string;
        conditions?: PolicyCondition[];
        action?: CallPolicy["action"];
        reason?: string | null;
    }) => {
        const { id, conditions, action, reason } = update;
        return archestraApiSdk.updateToolInvocationPolicy({
            headers: getAuthHeaders(),
            path: { id },
            body: {
                ...(action !== undefined && { action }),
                ...(reason !== undefined && { reason }),
                ...(conditions !== undefined && { conditions }),
            },
        });
    },
    onSuccess: () => revalidate("fetch-tool-invocation-policies"),
});

export function useUpdateCallPolicy() {
    return updateCallPolicy();
}

const deleteCallPolicy = createSubmission({
    callback: async (id: string) => {
        return archestraApiSdk.deleteToolInvocationPolicy({
            headers: getAuthHeaders(),
            path: { id },
        });
    },
    onSuccess: () => revalidate("fetch-tool-invocation-policies"),
});

export function useDeleteCallPolicy() {
    return deleteCallPolicy();
}

export const useResultPolicies = createQuery({
    queryKey: "fetch-result-policies",
    callback: () => archestraApiSdk.getTrustedDataPolicies({ headers: getAuthHeaders() }),
});

type ResultPolicyUpdate = Pick<ResultPolicy, "id" | "action" | "conditions">;

const saveResultPolicy = createSubmission({
    callback: async ({
        toolId,
        policy: { id, action, conditions },
    }: {
        toolId: string;
        policy: ResultPolicyUpdate;
    }) => {
        if (id) {
            return archestraApiSdk.updateTrustedDataPolicy({
                headers: getAuthHeaders(),
                path: { id },
                body: { action, conditions },
            });
        } else {
            return archestraApiSdk.createTrustedDataPolicy({
                headers: getAuthHeaders(),
                body: { toolId, action, conditions },
            });
        }
    },
    onSuccess: () => revalidate("fetch-result-policies"),
});

export function useSaveResultPolicy(policyId: string | undefined) {
    // Filter ensures each component only tracks its own submission state,
    // not submissions from other components using the same shared action.
    return saveResultPolicy(([{ policy }]) => policy?.id === policyId);
}

export function useBulkSaveResultPolicy() {
    return saveResultPolicy();
}

const createResultPolicy = createSubmission({
    callback: async ({ toolId, attributePath }: { toolId: string; attributePath: string }) => {
        return archestraApiSdk.createTrustedDataPolicy({
            headers: getAuthHeaders(),
            body: {
                toolId,
                conditions: [{ key: attributePath, operator: "equal", value: "" }],
                action: "mark_as_trusted",
            },
        });
    },
    onSuccess: () => revalidate("fetch-result-policies"),
});

export function useCreateResultPolicy() {
    return createResultPolicy();
}

const updateResultPolicy = createSubmission({
    callback: async (update: { id: string; conditions?: PolicyCondition[]; action?: ResultPolicy["action"] }) => {
        const { id, conditions, action } = update;
        return archestraApiSdk.updateTrustedDataPolicy({
            headers: getAuthHeaders(),
            path: { id },
            body: {
                ...(action !== undefined && { action }),
                ...(conditions !== undefined && { conditions }),
            },
        });
    },
    onSuccess: () => revalidate("fetch-result-policies"),
});

export function useUpdateResultPolicy() {
    return updateResultPolicy();
}

const deleteResultPolicy = createSubmission({
    callback: async (id: string) => {
        return archestraApiSdk.deleteTrustedDataPolicy({
            headers: getAuthHeaders(),
            path: { id },
        });
    },
    onSuccess: () => revalidate("fetch-result-policies"),
});

export function useDeleteResultPolicy() {
    return deleteResultPolicy();
}

const autoConfigurePolicies = createSubmission({
    callback: async (toolIds: string[]) => {
        return archestraApiSdk.autoConfigureAgentToolPolicies({
            headers: getAuthHeaders(),
            body: { toolIds },
        });
    },
    onSuccess: () => {
        revalidate("fetch-tool-invocation-policies");
        revalidate("fetch-result-policies");
    },
});

export function useAutoConfigurePolicies() {
    return autoConfigurePolicies();
}
