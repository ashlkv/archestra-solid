/**
 * API utilities for SolidStart.
 */
import { action, createAsync, json, query, revalidate, useAction, useSubmission } from "@solidjs/router";
import { createMemo } from "solid-js";
import { getRequestEvent } from "solid-js/web";

export type QueryResult<DataType> =
    | { data: () => DataType; query: { pending: false; error: undefined }; refetch: () => void }
    | { data: () => undefined; query: { pending: true; error: undefined }; refetch: () => void }
    | { data: () => undefined; query: { pending: false; error: Error }; refetch: () => void };

export type MutationResult<DataType> =
    | { submission: { pending: true; error: undefined }; submit: (data: DataType) => Promise<void> }
    | { submission: { pending: false; error: undefined }; submit: (data: DataType) => Promise<void> }
    | { submission: { pending: false; error: Error }; submit: (data: DataType) => Promise<void> };

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

type SdkResponse<T> = { data?: T; error?: { error?: { message?: string }; message?: string } };

/**
 * Factory for creating query hooks with TanStack Query-like API.
 */
export function createQuery<Data, Filter = void>({
    queryKey,
    callback,
}: {
    queryKey: string;
    callback: (params: Filter) => Promise<SdkResponse<Data>>;
}): (params: Filter | (() => Filter)) => QueryResult<Data> {
    const serverQuery = query(async (params: Filter) => {
        const response = await callback(params);
        const error = response.error?.error?.message || response.error?.message;
        return { data: response.data, error };
    }, queryKey);

    return (params: Filter | (() => Filter)): QueryResult<Data> => {
        const resolveParams = typeof params === "function" ? (params as () => Filter) : () => params;
        const result = createAsync(() => serverQuery(resolveParams()), { name: queryKey });
        // createMemo makes query state visible in Solid Inspector (appears under Memos).
        // Unlike createSignal+createEffect, memos are pull-based — they don't push reactive
        // updates, so they can't cause the inspector thrashing that the signal approach did.
        const data = createMemo(() => result()?.data as Data | undefined, undefined, { name: queryKey });
        const pending = createMemo(() => result() === undefined, true, { name: `${queryKey}:pending` });
        const error = createMemo(() => {
            const message = result()?.error;
            return message ? new Error(message) : undefined;
        }, undefined, { name: `${queryKey}:error` });
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
        const errorMessage = response.error?.error?.message || response.error?.message;
        if (errorMessage) throw new Error(errorMessage);
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
                    onError?.(exception instanceof Error ? exception : new Error(String(exception)));
                    throw exception;
                }
            },
        } as MutationResult<Payload>;
    };
}
