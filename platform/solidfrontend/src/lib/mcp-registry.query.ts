import { revalidate } from "@solidjs/router";
import { createQuery, createSubmission, getAuthHeaders } from "@/lib/api";
import { archestraApiSdk } from "@shared";
import { showToast, showError } from "@/components/primitives/Toast";
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

type DeleteMcpPayload = { id: string; name: string };

const deleteMcp = createSubmission({
    callback: async (payload: DeleteMcpPayload) => {
        return archestraApiSdk.deleteInternalMcpCatalogItem({
            headers: getAuthHeaders(),
            path: { id: payload.id },
        });
    },
    onSuccess: () => {
        revalidate("fetch-mcp-registry");
        revalidate("fetch-mcp-servers");
        showToast({ title: "Server deleted from catalog" });
    },
    onError: (exception) => showError(exception.message),
});

export function useDeleteMcp() {
    return deleteMcp();
}
