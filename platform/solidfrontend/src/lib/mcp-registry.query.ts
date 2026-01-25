import { action, createAsync, query, revalidate, useAction, useSubmission } from '@solidjs/router';
import { getAuthHeaders, type MutationResult, type QueryResult } from '@/lib/api';
import { archestraApiSdk } from "@shared";
import { type MCP } from '@/types';

const updateMcp = action(async function update(mcp: MCP) {
    const {id, ...body} = mcp;
    const result = await archestraApiSdk.updateInternalMcpCatalogItem({
        path: {id},
        body,
        // FIXME Remove getAuthHeaders call when auth is set up
        headers: getAuthHeaders(),
    })
    if (result.error) {
        throw new Error(result.error.message || "Failed to update MCP server");
    } else {
        return revalidate("fetch-mcp-registry");
    }
}, "update-mcp");

export function useUpdateMcp(): MutationResult<MCP> {
    const query = useSubmission(updateMcp);
    const update = useAction(updateMcp);
    return {update, query}
}

const fetchMcpRegistry = query(async function fetch() {
    // FIXME Remove getAuthHeaders call when auth is set up
    const headers = getAuthHeaders();
    const response = await archestraApiSdk.getInternalMcpCatalog({headers});
    return { data: response.data, error: response.error };
}, "fetch-mcp-registry")

export function useMcpRegistry(): QueryResult<MCP> {
    const result = createAsync(fetchMcpRegistry)
    return {
        data: () => result()?.data,
        query: {
            get error() { return result()?.error; },
            get pending() { return result() === undefined; },
        },
        refetch: () => revalidate("fetch-mcp-registry"),
    }
}

