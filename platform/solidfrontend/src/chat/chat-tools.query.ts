import { archestraApiSdk } from "@shared";
import { revalidate } from "@solidjs/router";
import { showError } from "@/primitives/Toast";
import { createQuery, createSubmission, getAuthHeaders } from "@/api";
import type { ChatToolItem } from "@/types";

type AgentToolItem = {
    id: string;
    name: string;
    description: string | null;
};

type EnabledToolsData = {
    hasCustomSelection: boolean;
    enabledToolIds: string[];
};

export const useProfileToolsWithIds = createQuery<AgentToolItem[], string>({
    queryKey: "fetch-profile-tools-with-ids",
    callback: async (agentId) => {
        if (!agentId) return { data: [], error: undefined };
        return archestraApiSdk.getAgentTools({
            headers: getAuthHeaders(),
            path: { agentId },
            query: { excludeLlmProxyOrigin: true } as any,
        });
    },
    initialValue: [],
});

export const useConversationEnabledTools = createQuery<EnabledToolsData | null, string>({
    queryKey: "fetch-conversation-enabled-tools",
    callback: async (conversationId) => {
        if (!conversationId) return { data: null, error: undefined };
        return archestraApiSdk.getConversationEnabledTools({
            headers: getAuthHeaders(),
            path: { id: conversationId },
        });
    },
    initialValue: null,
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
