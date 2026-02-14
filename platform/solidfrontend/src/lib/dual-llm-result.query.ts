import { archestraApiSdk } from "@shared";
import { createQuery, getAuthHeaders } from "@/lib/api";
import type { DualLlmResult } from "@/types";

export const useDualLlmResultsByInteraction = createQuery<DualLlmResult[], { interactionId: string }>({
    queryKey: "fetch-dual-llm-results",
    callback: async (params) => {
        const response = await archestraApiSdk.getDualLlmResultsByInteraction({
            headers: getAuthHeaders(),
            path: { interactionId: params.interactionId },
        });
        return { data: response.data ?? [], error: response.error };
    },
});
