import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { archestraApiSdk, type archestraApiTypes } from "@shared";

const { updateInternalMcpCatalogItem } = archestraApiSdk;

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
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mcp-catalog"] });
            queryClient.invalidateQueries({ queryKey: ["mcp-servers"] });
        },
    }));
}
