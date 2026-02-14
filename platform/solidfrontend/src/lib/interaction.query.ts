import { archestraApiSdk } from "@shared";
import { showError } from "@/components/primitives/Toast";
import { createQuery, getAuthHeaders } from "@/lib/api";
import type { Agent, Interaction, SessionData } from "@/types";
import { DEFAULT_TABLE_LIMIT } from "./interaction.utils";

type InteractionSessionsParams = {
    limit?: number;
    offset?: number;
    profileId?: string;
    userId?: string;
    sessionId?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
};

export const useInteractionSessions = createQuery<{ data: SessionData[]; total: number }, InteractionSessionsParams>({
    queryKey: "fetch-interaction-sessions",
    callback: async (params) => {
        const response = await archestraApiSdk.getInteractionSessions({
            headers: getAuthHeaders(),
            query: {
                limit: params.limit ?? DEFAULT_TABLE_LIMIT,
                offset: params.offset ?? 0,
                ...(params.profileId ? { profileId: params.profileId } : {}),
                ...(params.userId ? { userId: params.userId } : {}),
                ...(params.sessionId ? { sessionId: params.sessionId } : {}),
                ...(params.search ? { search: params.search } : {}),
                ...(params.startDate ? { startDate: params.startDate } : {}),
                ...(params.endDate ? { endDate: params.endDate } : {}),
            },
        });
        if (response.error) {
            showError(response.error?.error?.message ?? "Failed to fetch sessions");
            return { data: { data: [], total: 0 } };
        }
        return { data: { data: response.data?.data ?? [], total: response.data?.pagination?.total ?? 0 } };
    },
});

type InteractionsParams = {
    limit?: number;
    offset?: number;
    sessionId?: string;
    profileId?: string;
    sortBy?: string;
    sortDirection?: string;
};

export const useInteractions = createQuery<{ data: Interaction[]; total: number }, InteractionsParams>({
    queryKey: "fetch-interactions",
    callback: async (params) => {
        const response = await archestraApiSdk.getInteractions({
            headers: getAuthHeaders(),
            query: {
                limit: params.limit ?? DEFAULT_TABLE_LIMIT,
                offset: params.offset ?? 0,
                ...(params.sessionId ? { sessionId: params.sessionId } : {}),
                ...(params.profileId ? { profileId: params.profileId } : {}),
                ...(params.sortBy ? { sortBy: params.sortBy as any } : {}),
                ...(params.sortDirection ? { sortDirection: params.sortDirection as any } : {}),
            },
        });
        if (response.error) {
            showError(response.error?.error?.message ?? "Failed to fetch interactions");
            return { data: { data: [], total: 0 } };
        }
        return { data: { data: response.data?.data ?? [], total: response.data?.pagination?.total ?? 0 } };
    },
});

export const useInteraction = createQuery<Interaction | undefined, { interactionId: string }>({
    queryKey: "fetch-interaction",
    callback: async (params) => {
        const response = await archestraApiSdk.getInteraction({
            headers: getAuthHeaders(),
            path: { interactionId: params.interactionId },
        });
        if (response.error) {
            showError(response.error?.error?.message ?? "Failed to fetch interaction");
            return { data: undefined };
        }
        return { data: response.data };
    },
});

export const useUniqueUserIds = createQuery<Agent[]>({
    queryKey: "fetch-unique-user-ids",
    callback: async () => {
        const response = await archestraApiSdk.getUniqueUserIds({
            headers: getAuthHeaders(),
        });
        if (response.error) {
            return { data: [] };
        }
        return { data: response.data ?? [] };
    },
});
