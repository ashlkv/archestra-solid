import { archestraApiSdk } from "@shared";
import { createQuery, getAuthHeaders } from "@/api";
import type { ChatApiKey } from "@/types";

export const useAvailableChatApiKeys = createQuery<ChatApiKey[]>({
    queryKey: "fetch-available-chat-api-keys",
    callback: async () => archestraApiSdk.getAvailableChatApiKeys({
        headers: getAuthHeaders(),
    }),
    initialValue: [],
});
