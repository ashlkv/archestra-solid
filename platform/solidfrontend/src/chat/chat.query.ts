import { archestraApiSdk } from "@shared";
import { revalidate } from "@solidjs/router";
import { showError, showToast } from "@/primitives/Toast";
import { createQuery, createSubmission, getAuthHeaders } from "@/api";
import type { Conversation, ConversationListItem } from "@/types";

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export const useConversations = createQuery<ConversationListItem[]>({
    queryKey: "fetch-conversations",
    callback: async () => archestraApiSdk.getChatConversations({
        headers: getAuthHeaders(),
    }),
    initialValue: [],
});

export const useConversation = createQuery<Conversation | undefined, string>({
    queryKey: "fetch-conversation",
    callback: async (conversationId: string) => archestraApiSdk.getChatConversation({
        headers: getAuthHeaders(),
        path: { id: conversationId },
    }),
    initialValue: undefined,
});

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

type CreateConversationPayload = {
    agentId: string;
    title?: string;
    selectedModel?: string;
    selectedProvider?: string;
};

export const useCreateConversation = createSubmission<CreateConversationPayload, Conversation>({
    callback: async (payload) => {
        const response = await archestraApiSdk.createChatConversation({
            headers: getAuthHeaders(),
            body: payload as Parameters<typeof archestraApiSdk.createChatConversation>[0]["body"],
        });
        return response as { data?: Conversation; error?: { error?: { message?: string }; message?: string } };
    },
    onSuccess: () => revalidate("fetch-conversations"),
    onError: (error) => showError(error.message),
});

export const useUpdateConversation = createSubmission<{ id: string; title: string }>({
    callback: async (payload) => {
        return archestraApiSdk.updateChatConversation({
            headers: getAuthHeaders(),
            path: { id: payload.id },
            body: { title: payload.title },
        });
    },
    onSuccess: () => revalidate("fetch-conversations"),
    onError: (error) => showError(error.message),
});

export const useDeleteConversation = createSubmission<string>({
    callback: async (conversationId) => {
        return archestraApiSdk.deleteChatConversation({
            headers: getAuthHeaders(),
            path: { id: conversationId },
        });
    },
    onSuccess: () => {
        revalidate("fetch-conversations");
        showToast({ title: "Conversation deleted" });
    },
    onError: (error) => showError(error.message),
});
