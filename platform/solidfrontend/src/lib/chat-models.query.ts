import { archestraApiSdk, type SupportedProvider } from "@shared";
import { revalidate } from "@solidjs/router";
import { showError } from "@/components/primitives/Toast";
import { createQuery, createSubmission, getAuthHeaders } from "@/lib/api";
import type { ChatModel } from "@/types";

export const useChatModels = createQuery<ChatModel[]>({
    queryKey: "fetch-chat-models",
    callback: async () => {
        const { error, data } = await archestraApiSdk.getChatModels({
            headers: getAuthHeaders(),
        });
        return { data: data ?? [], error };
    },
});

export const useSyncChatModels = createSubmission<void>({
    callback: async () => {
        return archestraApiSdk.syncChatModels({
            headers: getAuthHeaders(),
        });
    },
    onSuccess: () => revalidate("fetch-chat-models"),
    onError: (error) => showError(error.message),
});

export function groupModelsByProvider(models: ChatModel[]): Partial<Record<SupportedProvider, ChatModel[]>> {
    return models.reduce(
        (accumulator, model) => {
            if (!accumulator[model.provider]) {
                accumulator[model.provider] = [];
            }
            accumulator[model.provider]!.push(model);
            return accumulator;
        },
        {} as Partial<Record<SupportedProvider, ChatModel[]>>,
    );
}
