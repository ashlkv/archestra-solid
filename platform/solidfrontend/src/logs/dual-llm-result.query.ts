import { archestraApiSdk } from "@shared";
import { createQuery, getAuthHeaders } from "@/api";
import type { DualLlmResult } from "@/types";

export const useDualLlmResultsByInteraction = createQuery<DualLlmResult[], { interactionId: string }>({
    queryKey: "fetch-dual-llm-results",
    callback: async (params) => archestraApiSdk.getDualLlmResultsByInteraction({
        headers: getAuthHeaders(),
        path: { interactionId: params.interactionId },
    }),
    initialValue: [],
});
