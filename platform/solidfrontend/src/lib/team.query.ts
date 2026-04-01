import { archestraApiSdk } from "@shared";
import { createQuery, getAuthHeaders } from "@/api";

export const useTeams = createQuery({
    queryKey: "fetch-teams",
    callback: () => archestraApiSdk.getTeams({ headers: getAuthHeaders() }),
});
