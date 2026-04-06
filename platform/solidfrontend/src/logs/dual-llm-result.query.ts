import { createQuery, getAuthHeaders } from "@/api";
import type { DualLlmResult } from "@/types";

// TODO: This API endpoint doesn't exist yet in the SDK
// Need to regenerate SDK after backend implements getDualLlmResultsByInteraction
export const useDualLlmResultsByInteraction = createQuery<DualLlmResult[], { interactionId: string }>({
    queryKey: "fetch-dual-llm-results",
    callback: async (_params) => {
        // Placeholder until API is implemented
        return { data: [] as DualLlmResult[] };
    },
    initialValue: [],
});
