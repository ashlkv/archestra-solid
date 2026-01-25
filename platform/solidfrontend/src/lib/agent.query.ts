import { revalidate } from "@solidjs/router";
import { createQuery, createSubmission, getAuthHeaders } from "@/lib/api";
import { archestraApiSdk } from "@shared";
import { showError } from "@/components/primitives/Toast";

type Agent = { id: string; name: string };

export const useAgents = createQuery({
    queryKey: "fetch-agents",
    callback: async () => {
        const {error, data: {data: profiles} = {}} = await archestraApiSdk.getAgents({ headers: getAuthHeaders() });
        return { data: profiles, error };
    },
});

type AssignToolParams = { agentId: string; toolId: string };

const assignTool = createSubmission({
    callback: async ({ agentId, toolId }: AssignToolParams) => {
        return archestraApiSdk.assignToolToAgent({
            headers: getAuthHeaders(),
            path: { agentId, toolId },
            body: { toolId },
        });
    },
    onSuccess: () => revalidate("fetch-tools"),
    onError: (error) => showError(error.message),
});

export function useAssignTool(toolId: string) {
    return assignTool(([payload]) => payload.toolId === toolId);
}
