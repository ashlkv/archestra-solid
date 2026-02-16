import { archestraApiSdk } from "@shared";
import { getAuthHeaders } from "@/lib/api";

export async function fetchUserTokenValue(): Promise<string | undefined> {
    const response = await archestraApiSdk.getUserTokenValue({ headers: getAuthHeaders() });
    const data = response.data as { value?: string } | undefined;
    return data?.value;
}
