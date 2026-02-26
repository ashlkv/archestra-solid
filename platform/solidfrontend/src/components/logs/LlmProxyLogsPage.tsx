import { useSearchParams } from "@solidjs/router";
import { createSignal, type JSX, Show } from "solid-js";
import { InteractionDrawer } from "@/components/logs/InteractionDrawer";
import { Pagination } from "@/components/logs/Pagination";
import { SessionsFilters } from "@/components/logs/SessionsFilters";
import { SessionsTable } from "@/components/logs/SessionsTable";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/primitives/Empty";
import { PageHeader } from "@/components/primitives/PageHeader";
import { Spinner } from "@/components/primitives/Spinner";
import { useAgents } from "@/lib/agent.query";
import { useInteractionSessions, useUniqueUserIds } from "@/lib/interaction.query";
import { DEFAULT_TABLE_LIMIT } from "@/lib/interaction.utils";
import { Main } from "~/components/primitives/Main";

const LLM_PROXY_BASE = "/logs/llm-proxy";

export function LlmProxyLogsPage(): JSX.Element {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = () => Number(asString(searchParams.page) || "0");
    const pageSize = () => Number(asString(searchParams.pageSize) || String(DEFAULT_TABLE_LIMIT));
    const profileId = () => asString(searchParams.profileId);
    const userId = () => asString(searchParams.userId);
    const search = () => asString(searchParams.search);
    const startDate = () => asString(searchParams.startDate);
    const endDate = () => asString(searchParams.endDate);

    const queryParams = () => ({
        limit: pageSize(),
        offset: page() * pageSize(),
        profileId: profileId() || undefined,
        userId: userId() || undefined,
        search: search() || undefined,
        startDate: startDate() || undefined,
        endDate: endDate() || undefined,
    });

    const { data: sessionsData, query: sessionsQuery } = useInteractionSessions(queryParams);
    const { data: agents } = useAgents();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: userIds } = useUniqueUserIds();

    const sessions = () => sessionsData()?.data ?? [];
    const total = () => sessionsData()?.total ?? 0;
    const hasFilters = () => !!(profileId() || userId() || search() || startDate());

    // Drawer state
    const initialEntryId = parseInitialEntryId();
    const [activeInteractionId, setActiveInteractionId] = createSignal<string | null>(initialEntryId);

    const openDrawer = (interactionId: string) => {
        setActiveInteractionId(interactionId);
        replaceUrl(`${window.location.pathname}/entry/${interactionId}`);
    };

    const closeDrawer = () => {
        setActiveInteractionId(null);
        // Strip /entry/... from the URL
        const pathname = window.location.pathname.replace(/\/entry\/[^/]+$/, "");
        replaceUrl(pathname || LLM_PROXY_BASE);
    };

    return (
        <>
            <PageHeader
                title="Logs"
                description="View all logs including LLM proxy interactions and MCP gateway tool calls."
            />
            <Main>
                <SessionsFilters
                    search={search()}
                    onSearchChange={(value) => setSearchParams({ search: value || undefined, page: "0" })}
                />

                <Show when={sessionsQuery.pending}>
                    <div style={{ display: "flex", "justify-content": "center", padding: "3rem" }}>
                        <Spinner />
                    </div>
                </Show>

                <Show when={!sessionsQuery.pending && sessionsQuery.error}>
                    <div style={{ color: "var(--destructive)", padding: "1rem" }}>
                        Failed to load sessions: {sessionsQuery.error?.message}
                    </div>
                </Show>

                <Show when={!sessionsQuery.pending && !sessionsQuery.error && sessions().length === 0}>
                    <Empty>
                        <EmptyTitle>No sessions found</EmptyTitle>
                        <EmptyDescription>
                            {hasFilters() ? "Try adjusting your filters." : "No LLM proxy sessions recorded yet."}
                        </EmptyDescription>
                    </Empty>
                </Show>

                <Show when={!sessionsQuery.pending && !sessionsQuery.error && sessions().length > 0}>
                    <SessionsTable
                        sessions={sessions()}
                        agents={agents() ?? []}
                        activeInteractionId={activeInteractionId()}
                        onInteractionSelect={openDrawer}
                    />

                    <Pagination
                        page={page()}
                        pageSize={pageSize()}
                        total={total()}
                        onPageChange={(newPage) => setSearchParams({ page: String(newPage) })}
                    />
                </Show>
            </Main>

            <InteractionDrawer
                interactionId={activeInteractionId()}
                open={activeInteractionId() !== null}
                onOpenChange={(open) => {
                    if (!open) closeDrawer();
                }}
            />
        </>
    );
}

function asString(value: string | string[] | undefined): string {
    if (Array.isArray(value)) return value[0] ?? "";
    return value ?? "";
}

function replaceUrl(path: string): void {
    const searchParams = window.location.search;
    window.history.replaceState(null, "", `${path}${searchParams}`);
}

function parseInitialEntryId(): string | null {
    if (typeof window === "undefined") return null;
    const match = window.location.pathname.match(/\/entry\/([^/]+)$/);
    return match?.[1] ?? null;
}
