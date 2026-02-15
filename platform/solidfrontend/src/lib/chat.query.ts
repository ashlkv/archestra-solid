import { archestraApiSdk } from "@shared";
import { revalidate } from "@solidjs/router";
import { showError, showToast } from "@/components/primitives/Toast";
import { createQuery, createSubmission, getAuthHeaders } from "@/lib/api";
import type { Conversation, ConversationListItem } from "@/types";

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export const useConversations = createQuery<ConversationListItem[]>({
    queryKey: "fetch-conversations",
    callback: async () => {
        const { error, data } = await archestraApiSdk.getChatConversations({
            headers: getAuthHeaders(),
        });
        return { data: data as ConversationListItem[] | undefined, error };
    },
});

export const useConversation = createQuery<Conversation, string>({
    queryKey: "fetch-conversation",
    callback: async (conversationId: string) => {
        const { error, data } = await archestraApiSdk.getChatConversation({
            headers: getAuthHeaders(),
            path: { id: conversationId },
        });
        return { data: data as Conversation | undefined, error };
    },
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
