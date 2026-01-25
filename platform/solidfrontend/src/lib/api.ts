/**
 * API utilities for SolidStart.
 */
import { getRequestEvent } from "solid-js/web";

export type QueryResult<DataType> = {
    readonly data: DataType | undefined;
    readonly query: {
        readonly error: Error;
        readonly pending: boolean;
    }
    refetch: () => void;
}

export type MutationResult<DataType> = {
    readonly query: {
        readonly error: Error;
        readonly pending: boolean;
    };
    readonly update: (data: DataType) => Promise<undefined>;
}

/**
 * Get auth headers for API calls.
 * - Server: forward cookies from the incoming request
 * - Client: return empty (browser sends cookies automatically via credentials: 'include')
 *
 * FIXME: Remove once auth is set up in SolidStart
 */
export function getAuthHeaders(): Record<string, string> | {} {
    const isServer = typeof window === "undefined";
    if (isServer) {
        const event = getRequestEvent();
        const cookies = event?.request.headers.get("cookie");
        return cookies ? { cookie: cookies } : {};
    }
    // Client-side: browser handles cookies automatically
    return {};
}
