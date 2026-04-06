/**
 * API utilities for SolidStart.
 */
import { action, createAsync, json, query, revalidate, useAction, useSubmission } from "@solidjs/router";
import { createMemo } from "solid-js";
import { getRequestEvent } from "solid-js/web";

export class ApiError extends Error {
    constructor(
        message: string,
        public readonly httpStatus?: number,
        public readonly code?: string,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export type QueryResult<DataType> =
    | { data: () => DataType; query: { pending: false; error: undefined }; pagination: () => { total: number; limit: number; offset: number } | undefined; refetch: () => void }
    | { data: () => undefined; query: { pending: true; error: undefined }; pagination: () => undefined; refetch: () => void }
    | { data: () => undefined; query: { pending: false; error: ApiError }; pagination: () => undefined; refetch: () => void };

export type MutationResult<DataType> =
    | { submission: { pending: true; error: undefined }; submit: (data: DataType) => Promise<void> }
    | { submission: { pending: false; error: undefined }; submit: (data: DataType) => Promise<void> }
    | { submission: { pending: false; error: ApiError }; submit: (data: DataType) => Promise<void> };

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
    return {};
}

type SdkResponse<T> = {
    data?: T;
    error?: {
        error?: { message?: string; code?: string } | string;
        message?: string;
        code?: string;
    };
    response?: Response;
};

/**
 * Transform SDK error format to ApiError with HTTP status and error code.
 * SDK returns: { error: { error: string, code?: string }, response: Response }
 * We create: ApiError(message, httpStatus, code)
 */
function extractError(response: SdkResponse<unknown>): ApiError | undefined {
    if (!response.error) return undefined;

    let message: string | undefined;
    let code: string | undefined;

    // Check for nested error.error (can be string or object with message + code)
    if (response.error.error) {
        if (typeof response.error.error === 'string') {
            message = response.error.error;
        } else if (response.error.error.message) {
            message = response.error.error.message;
            code = response.error.error.code;
        }
    }

    // Fallback to top-level message and code
    if (!message) {
        message = response.error.message;
    }
    if (!code) {
        code = response.error.code;
    }

    // Default error message if none found
    if (!message) {
        message = 'An unknown error occurred';
    }

    const httpStatus = response.response?.status;
    return new ApiError(message, httpStatus, code);
}

/**
 * Factory for creating query hooks with TanStack Query-like API.
 */
export function createQuery<Data, Filter = void>({
    queryKey,
    callback,
    initialValue,
}: {
    queryKey: string;
    callback: (params: Filter) => Promise<SdkResponse<Data>>;
    initialValue: Data;
}): (params: Filter | (() => Filter)) => QueryResult<Data> {
    const serverQuery = query(async (params: Filter) => {
        const response = await callback(params);
        const error = extractError(response);
        // Unwrap paginated responses ({ data: { data: T[], pagination } }) but pass through non-paginated ({ data: T })
        const data = response.data && typeof response.data === 'object' && 'data' in response.data
            ? response.data.data
            : response.data;
        const pagination = response.data && typeof response.data === 'object' && 'pagination' in response.data
            ? response.data.pagination
            : undefined;
        return { data, error, pagination };
    }, queryKey);

    return (params: Filter | (() => Filter)): QueryResult<Data> => {
        const resolveParams = typeof params === "function" ? (params as () => Filter) : () => params;
        const result = createAsync(() => serverQuery(resolveParams()), { name: queryKey });
        // createMemo makes query state visible in Solid Inspector (appears under Memos).
        // Unlike createSignal+createEffect, memos are pull-based — they don't push reactive
        // updates, so they can't cause the inspector thrashing that the signal approach did.
        const data = createMemo(() => result()?.data as Data | undefined, initialValue, { name: queryKey });
        const pending = createMemo(() => result() === undefined, true, { name: `${queryKey}:pending` });
        const error = createMemo(() => result()?.error, undefined, { name: `${queryKey}:error` });
        const pagination = createMemo(() => result()?.pagination as { total: number; limit: number; offset: number } | undefined, undefined, { name: `${queryKey}:pagination` });
        return {
            data,
            query: {
                get error() {
                    return error();
                },
                get pending() {
                    return pending();
                },
            },
            pagination,
            refetch: () => revalidate(queryKey),
        } as QueryResult<Data>;
    };
}

/**
 * Factory for creating mutation hooks with TanStack Query-like API.
 */
export function createSubmission<Payload, Result = unknown>({
    callback,
    onSuccess,
    onError,
}: {
    callback: (update: Payload) => Promise<SdkResponse<Result>>;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}): (filter?: (args: [Payload]) => boolean) => MutationResult<Payload> {
    const serverAction = action(async (input: Payload) => {
        const response = await callback(input);
        const error = extractError(response);
        if (error) throw error;
        return json(response.data, { revalidate: [] });
    });

    return (filter?: (args: [Payload]) => boolean): MutationResult<Payload> => {
        const trigger = useAction(serverAction);
        const submission = filter ? useSubmission(serverAction, filter) : useSubmission(serverAction);

        return {
            /**
             * Unlike flat object returned by tanstack query {mutation, isPending, isError},
             * we have to return query flags in their own separate object to preserve the getters and the reactivity.
             */
            submission: {
                /**
                 * Normally to preserve reactivity everything returned from query functions is a signal (a function)
                 * but submission properties for convenience use getters so that it's possible to submission.pending like in docs
                 * https://docs.solidjs.com/solid-start/guides/data-mutation
                 */
                get error() {
                    return submission.error as Error | undefined;
                },
                get pending() {
                    return submission.pending ?? false;
                },
            },
            submit: async (input: Payload) => {
                try {
                    await (trigger as (input: Payload) => Promise<void>)(input);
                    onSuccess?.();
                } catch (exception) {
                    const error = exception instanceof ApiError
                        ? exception
                        : exception instanceof Error
                            ? exception
                            : new Error(String(exception));
                    onError?.(error);
                    throw exception;
                }
            },
        } as MutationResult<Payload>;
    };
}
