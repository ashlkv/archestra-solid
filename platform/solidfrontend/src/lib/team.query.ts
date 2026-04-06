import { archestraApiSdk } from "@shared";
import { createQuery, getAuthHeaders } from "@/api";
import { Team } from '@/types';

export const useTeams = createQuery<Team[]>({
    queryKey: "fetch-teams",
    callback: async () => archestraApiSdk.getTeams({ headers: getAuthHeaders() }) as any,
    initialValue: [],
});
