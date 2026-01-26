import { revalidate } from "@solidjs/router";
import { createQuery, createSubmission, getAuthHeaders } from "@/lib/api";
import { archestraApiSdk } from "@shared";
import type { MCP } from "@/types";

export const useMcpRegistry = createQuery({
    queryKey: "fetch-mcp-registry",
    callback: () => archestraApiSdk.getInternalMcpCatalog({ headers: getAuthHeaders() }),
});

export const useMcpServers = createQuery({
    queryKey: "fetch-mcp-servers",
    callback: () => archestraApiSdk.getMcpServers({ headers: getAuthHeaders() }),
});

const updateMcp = createSubmission({
    callback: async (mcp: MCP) => {
        const { id, ...body } = mcp;
        return archestraApiSdk.updateInternalMcpCatalogItem({
            headers: getAuthHeaders(),
            path: { id },
            body,
        });
    },
    onSuccess: () => revalidate("fetch-mcp-registry"),
});

export function useUpdateMcp() {
    return updateMcp();
}
