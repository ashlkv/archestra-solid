import { archestraApiSdk } from "@shared";
import { revalidate } from "@solidjs/router";
import { showError } from "@/components/primitives/Toast";
import { createQuery, createSubmission, getAuthHeaders } from "@/lib/api";
import type { ChatToolItem } from "@/types";

type AgentToolItem = {
    id: string;
    name: string;
    description: string | null;
};

type GlobalToolItem = {
    id: string;
    name: string;
    description: string | null;
    catalogId: string;
};

type EnabledToolsData = {
    hasCustomSelection: boolean;
    enabledToolIds: string[];
};

export const useProfileToolsWithIds = createQuery<AgentToolItem[], string>({
    queryKey: "fetch-profile-tools-with-ids",
    callback: async (agentId) => {
        if (!agentId) return { data: [], error: undefined };
        const { error, data } = await archestraApiSdk.getAgentTools({
            headers: getAuthHeaders(),
            path: { agentId },
            query: { excludeLlmProxyOrigin: true },
        });
        return { data: (data ?? []) as AgentToolItem[], error };
    },
});

export const useGlobalChatTools = createQuery<GlobalToolItem[]>({
    queryKey: "fetch-global-chat-tools",
    callback: async () => {
        const { error, data } = await archestraApiSdk.getChatGlobalTools({
            headers: getAuthHeaders(),
        });
        return { data: (data ?? []) as GlobalToolItem[], error };
    },
});

export const useConversationEnabledTools = createQuery<EnabledToolsData | null, string>({
    queryKey: "fetch-conversation-enabled-tools",
    callback: async (conversationId) => {
        if (!conversationId) return { data: null, error: undefined };
        const { error, data } = await archestraApiSdk.getConversationEnabledTools({
            headers: getAuthHeaders(),
            path: { id: conversationId },
        });
        return { data: data ?? null, error };
    },
});

export const useUpdateConversationEnabledTools = createSubmission<{
    conversationId: string;
    toolIds: string[];
}>({
    callback: async (params) => {
        return archestraApiSdk.updateConversationEnabledTools({
            headers: getAuthHeaders(),
            path: { id: params.conversationId },
            body: { toolIds: params.toolIds },
        });
    },
    onSuccess: () => revalidate("fetch-conversation-enabled-tools"),
    onError: (error) => showError(error.message),
});
