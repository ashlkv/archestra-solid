import { archestraApiSdk } from "@shared";
import { revalidate } from "@solidjs/router";
import { showError } from "@/primitives/Toast";
import { createQuery, createSubmission, getAuthHeaders } from "@/api";
import type { Agent, AgentDetail } from "@/types";

export const useAgents = createQuery<Agent[]>({
    queryKey: "fetch-agents",
    callback: async () => archestraApiSdk.getAgents({ headers: getAuthHeaders() }) as any,
    initialValue: []
});

export const useAgent = createQuery<AgentDetail | undefined, string>({
    queryKey: "fetch-agent",
    callback: async (agentId: string) => archestraApiSdk.getAgent({
        headers: getAuthHeaders(),
        path: { id: agentId },
    }),
    initialValue: undefined,
});

type UpdateAgentPayload = { id: string; [key: string]: unknown };

const updateAgent = createSubmission<UpdateAgentPayload>({
    callback: async (payload) => {
        const { id, ...body } = payload;
        return archestraApiSdk.updateAgent({
            headers: getAuthHeaders(),
            path: { id },
            body: body as Parameters<typeof archestraApiSdk.updateAgent>[0]["body"],
        });
    },
    onSuccess: () => {
        revalidate("fetch-agent");
        revalidate("fetch-agents");
    },
    onError: (error) => showError(error.message),
});

export function useUpdateAgent() {
    return updateAgent();
}

type AssignToolParams = { agentId: string; toolId: string };

const assignTool = createSubmission({
    callback: async ({ agentId, toolId }: AssignToolParams) => {
        return archestraApiSdk.assignToolToAgent({
            headers: getAuthHeaders(),
            path: { agentId, toolId },
            body: { useDynamicTeamCredential: true },
        });
    },
    onSuccess: () => {
        revalidate("fetch-tools");
        revalidate("fetch-agent");
    },
    onError: (error) => showError(error.message),
});

export function useAssignTool(toolId?: string) {
    return assignTool(toolId ? ([payload]) => payload.toolId === toolId : undefined);
}

const unassignToolFromAgent = createSubmission({
    callback: async ({ agentId, toolId }: AssignToolParams) => {
        return archestraApiSdk.unassignToolFromAgent({
            headers: getAuthHeaders(),
            path: { agentId, toolId },
        });
    },
    onSuccess: () => {
        revalidate("fetch-tools");
        revalidate("fetch-agent");
    },
    onError: (error) => showError(error.message),
});

export function useUnassignToolFromAgent() {
    return unassignToolFromAgent();
}
