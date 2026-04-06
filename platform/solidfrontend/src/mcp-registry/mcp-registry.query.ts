import { archestraApiSdk, type archestraApiTypes, archestraCatalogSdk } from "@shared";
import { revalidate } from "@solidjs/router";
import { showError, showToast } from "@/primitives/Toast";
import { createQuery, createSubmission, getAuthHeaders } from "@/api";
import type { MCP } from "@/types";

type UpdateMcpPayload = {
    id: string;
    body: NonNullable<archestraApiTypes.UpdateInternalMcpCatalogItemData["body"]>;
};

export const useMcpRegistry = createQuery({
    queryKey: "fetch-mcp-registry",
    callback: () => archestraApiSdk.getInternalMcpCatalog({ headers: getAuthHeaders() }),
    initialValue: [],
});

export const useMcpServers = createQuery({
    queryKey: "fetch-mcp-servers",
    callback: () => archestraApiSdk.getMcpServers({ headers: getAuthHeaders() }),
    initialValue: [],
});

const updateMcp = createSubmission({
    callback: async (payload: UpdateMcpPayload) => {
        return archestraApiSdk.updateInternalMcpCatalogItem({
            headers: getAuthHeaders(),
            path: { id: payload.id },
            body: payload.body,
        });
    },
    onSuccess: () => {
        revalidate("fetch-mcp-registry");
        revalidate("fetch-mcp-servers");
        showToast({ title: "Server updated" });
    },
    onError: (exception) => showError(exception.message),
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

export const useMcpServerDetails = createQuery({
    queryKey: "fetch-mcp-server-details",
    callback: (name: string) => archestraCatalogSdk.getMcpServer({ path: { name } }),
    initialValue: undefined,
});

export const useCatalogTools = createQuery({
    queryKey: "fetch-catalog-tools",
    callback: async (catalogId: string) => archestraApiSdk.getInternalMcpCatalogTools({
        headers: getAuthHeaders(),
        path: { id: catalogId },
    }),
    initialValue: [],
});

export async function fetchCatalogTools(catalogId: string) {
    const response = await archestraApiSdk.getInternalMcpCatalogTools({
        headers: getAuthHeaders(),
        path: { id: catalogId },
    });
    return response.data ?? [];
}
