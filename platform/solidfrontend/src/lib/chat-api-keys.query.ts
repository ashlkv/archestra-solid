import { archestraApiSdk } from "@shared";
import { createQuery, getAuthHeaders } from "@/lib/api";
import type { ChatApiKey } from "@/types";

export const useAvailableChatApiKeys = createQuery<ChatApiKey[]>({
    queryKey: "fetch-available-chat-api-keys",
    callback: async () => {
        const { error, data } = await archestraApiSdk.getAvailableChatApiKeys({
            headers: getAuthHeaders(),
        });
        return { data: data ?? [], error };
    },
});
