/**
 * API utilities for SolidStart.
 */
import { getRequestEvent } from "solid-js/web";
import { createAsync } from '@solidjs/router';

type ApiResult<DataType> = {
    data?: DataType;
    error?: { error?: { message?: string } };
};

/**
 * Get auth headers for API calls.
 * - Server: forward cookies from the incoming request
 * - Client: return empty (browser sends cookies automatically via credentials: 'include')
 *
 * FIXME: Remove once auth is set up in SolidStart
 */
export function getAuthHeaders(): Record<string, string> {
    const isServer = typeof window === "undefined";
    if (isServer) {
        const event = getRequestEvent();
        const cookies = event?.request.headers.get("cookie");
        return cookies ? { cookie: cookies } : {};
    }
    // Client-side: browser handles cookies automatically
    return {};
}

/**
 * Server-side fetch with auth headers. Returns a signal for use in components.
 */
export function serversideFetch<DataType>(
    fetcher: (headers: Record<string, string>) => Promise<ApiResult<DataType>>,
) {
    return createAsync(async function serverFn() {
        // "use server";
        const headers = getAuthHeaders();
        const response = await fetcher(headers);
        return response.data;
    });
}
