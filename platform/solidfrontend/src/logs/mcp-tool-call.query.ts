import { archestraApiSdk } from "@shared";
import { showError } from "@/primitives/Toast";
import { createQuery, getAuthHeaders } from "@/api";
import type { McpToolCallData } from "@/types";
import { DEFAULT_SORT_BY, DEFAULT_SORT_DIRECTION, DEFAULT_TABLE_LIMIT } from "./interaction.utils";

type McpToolCallsParams = {
    limit?: number;
    offset?: number;
    agentId?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortDirection?: string;
};

export const useMcpToolCalls = createQuery<McpToolCallData[], McpToolCallsParams>({
    queryKey: "fetch-mcp-tool-calls",
    callback: async (params) => {
        const response = await archestraApiSdk.getMcpToolCalls({
            headers: getAuthHeaders(),
            query: {
                limit: params.limit ?? DEFAULT_TABLE_LIMIT,
                offset: params.offset ?? 0,
                ...(params.agentId ? { agentId: params.agentId } : {}),
                ...(params.search ? { search: params.search } : {}),
                ...(params.startDate ? { startDate: params.startDate } : {}),
                ...(params.endDate ? { endDate: params.endDate } : {}),
                sortBy: (params.sortBy ?? DEFAULT_SORT_BY) as any,
                sortDirection: (params.sortDirection ?? DEFAULT_SORT_DIRECTION) as any,
            },
        });
        if (response.error) {
            showError(response.error?.error?.message ?? "Failed to fetch MCP tool calls");
        }
        return response;
    },
    initialValue: [],
});

export const useMcpToolCall = createQuery<McpToolCallData | undefined, { mcpToolCallId: string }>({
    queryKey: "fetch-mcp-tool-call",
    callback: async (params) => {
        const response = await archestraApiSdk.getMcpToolCall({
            headers: getAuthHeaders(),
            path: { mcpToolCallId: params.mcpToolCallId },
        });
        if (response.error) {
            showError(response.error?.error?.message ?? "Failed to fetch MCP tool call");
        }
        return response;
    },
    initialValue: undefined,
});
