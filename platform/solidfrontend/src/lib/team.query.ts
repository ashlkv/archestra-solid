import { createQuery, getAuthHeaders } from "@/lib/api";
import { archestraApiSdk } from "@shared";

export const useTeams = createQuery({
    queryKey: "fetch-teams",
    callback: () => archestraApiSdk.getTeams({ headers: getAuthHeaders() }),
});
