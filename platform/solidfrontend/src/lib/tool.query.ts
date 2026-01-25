import { revalidate } from "@solidjs/router";
import { createQuery, createSubmission, getAuthHeaders } from "@/lib/api";
import { archestraApiSdk } from "@shared";
import { showError } from "@/components/primitives/Toast";
import type { Tool, ToolsQueryParams } from "@/types";

export const useTools = createQuery({
    queryKey: "fetch-tools",
    callback: async (params: ToolsQueryParams = {}) => {
        const response = await archestraApiSdk.getToolsWithAssignments({
            headers: getAuthHeaders(),
            query: {
                limit: params.limit ?? 50,
                offset: params.offset ?? 0,
                sortBy: params.sortBy ?? "createdAt",
                sortDirection: params.sortDirection ?? "desc",
                search: params.search,
                origin: params.origin,
            },
        });
        // Extract nested data array for convenience
        return { data: response.data?.data, error: response.error };
    },
});

type UnassignToolParams = { agentId: string; toolId: string };

const unassignTool = createSubmission({
    callback: async ({ agentId, toolId }: UnassignToolParams) => {
        return archestraApiSdk.unassignToolFromAgent({
            headers: getAuthHeaders(),
            path: { agentId, toolId },
        });
    },
    onSuccess: () => revalidate("fetch-tools"),
    onError: (error) => showError(error.message),
});

export function useUnassignTool() {
    return unassignTool();
}
