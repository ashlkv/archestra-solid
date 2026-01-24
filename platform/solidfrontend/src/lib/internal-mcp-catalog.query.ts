import { createMutation, createQuery, useQueryClient } from "@tanstack/solid-query";
import { archestraApiSdk, type archestraApiTypes } from "@shared";
import { getAuthHeaders } from "./api";

const { getInternalMcpCatalog, updateInternalMcpCatalogItem } = archestraApiSdk;

export function useUpdateInternalMcpCatalogItem() {
    const queryClient = useQueryClient();

    return createMutation(() => ({
        mutationFn: async (params: {
            id: string;
            data: archestraApiTypes.UpdateInternalMcpCatalogItemData["body"];
        }) => {
            const response = await updateInternalMcpCatalogItem({
                path: { id: params.id },
                body: params.data,
                // FIXME Remove when auth is set up
                headers: getAuthHeaders(),
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mcp-catalog"] });
        },
    }));
}

export function useInternalMcpCatalog(params?: {
    initialData?: archestraApiTypes.GetInternalMcpCatalogResponses["200"];
}) {
    return createQuery(() => ({
        queryKey: ["mcp-catalog"],
        // FIXME Remove getAuthHeaders when auth is set up
        queryFn: async () => {
            const response = await getInternalMcpCatalog({ headers: getAuthHeaders() });
            return response.data ?? [];
        },
        initialData: params?.initialData,
    }));
}
