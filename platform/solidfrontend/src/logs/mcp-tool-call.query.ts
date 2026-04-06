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
    callback: async (params) => archestraApiSdk.getMcpToolCalls({
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
    }),
    onError: (error) => showError(error.message ?? "Failed to fetch MCP tool calls"),
    initialValue: [],
});

export const useMcpToolCall = createQuery<McpToolCallData | undefined, { mcpToolCallId: string }>({
    queryKey: "fetch-mcp-tool-call",
    callback: async (params) => archestraApiSdk.getMcpToolCall({
        headers: getAuthHeaders(),
        path: { mcpToolCallId: params.mcpToolCallId },
    }),
    onError: (error) => showError(error.message ?? "Failed to fetch MCP tool call"),
    initialValue: undefined,
});
