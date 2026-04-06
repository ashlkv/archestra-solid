import { archestraApiSdk } from "@shared";
import { revalidate } from "@solidjs/router";
import { showError } from "@/primitives/Toast";
import { createQuery, createSubmission, getAuthHeaders } from "@/api";
import type { Tool, ToolsQueryParams } from "@/types";

export const useTools = createQuery<Tool[], ToolsQueryParams>({
    queryKey: "fetch-tools",
    callback: async (params: ToolsQueryParams = {}) => archestraApiSdk.getToolsWithAssignments({
        headers: getAuthHeaders(),
        query: {
            limit: params.limit ?? 50,
            offset: params.offset ?? 0,
            sortBy: params.sortBy ?? "createdAt",
            sortDirection: params.sortDirection ?? "desc",
            search: params.search,
            origin: params.origin,
        },
    }),
    initialValue: [],
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
