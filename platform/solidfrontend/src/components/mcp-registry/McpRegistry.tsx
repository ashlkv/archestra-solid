import { createSignal, For, Show } from "solid-js";
import { AddMcpCard } from "./AddMcpCard";
import { McpCard } from "./McpCard";
import { McpInstallDialog } from "./McpInstallDialog";
import { McpDeleteDialog } from "./McpDeleteDialog";
import { McpLogsDialog } from "./McpLogsDialog";
import { ToolTable } from "../tools/ToolTable";
import { Alert } from "../primitives/Alert";
import { Button } from "../primitives/Button";
import { Empty, EmptyDescription } from "../primitives/Empty";
import { useTools } from "@/lib/tool.query";
import { useAgents } from "@/lib/agent.query";
import { useToolCallPolicies, useResultPolicies } from "@/lib/policy.query";
import { useMcpServers, useDeleteMcp } from "@/lib/mcp-registry.query";
import { useInstallMcpServer } from "@/lib/mcp-server.query";
import type { MCP } from "@/types";
import styles from "./McpRegistry.module.css";

export function McpRegistry(props: {
    catalog: MCP[] | undefined;
    error?: boolean;
    pending?: boolean;
    onAddClick?: () => void;
}) {
    const { data: mcpServers } = useMcpServers();
    const { submit: installServer, submission: installSubmission } = useInstallMcpServer();
    const { submit: deleteMcp, submission: deleteSubmission } = useDeleteMcp();

    const getInstances = (catalogId: string) => {
        return (mcpServers() ?? []).filter((server) => server.catalogId === catalogId);
    };

    const [selectedId, setSelectedId] = createSignal<string | undefined>(undefined);
    const [installItem, setInstallItem] = createSignal<MCP | undefined>(undefined);
    const [deleteItem, setDeleteItem] = createSignal<MCP | undefined>(undefined);
    const [logsItem, setLogsItem] = createSignal<MCP | undefined>(undefined);

    const selectedMcp = () => props.catalog?.find((item) => item.id === selectedId());

    const { data: allTools, query: toolsQuery } = useTools({ limit: 100, offset: 0 });
    const { data: agents } = useAgents();
    const { data: callPolicies } = useToolCallPolicies();
    const { data: resultPolicies } = useResultPolicies();

    const tools = () => {
        const selected = selectedId();
        if (!selected) return [];
        return (allTools() ?? []).filter((tool) => tool.catalogId === selected);
    };

    const onInstallSubmit = async (catalogItem: MCP, result: {
        teamId: string | undefined;
        environmentValues?: Record<string, string>;
        serviceAccount?: string;
        metadata?: Record<string, unknown>;
    }) => {
        const accessToken =
            result.metadata?.access_token && typeof result.metadata.access_token === "string"
                ? result.metadata.access_token
                : undefined;

        await installServer({
            name: catalogItem.name,
            catalogId: catalogItem.id,
            environmentValues: result.environmentValues,
            teamId: result.teamId ?? undefined,
            serviceAccount: result.serviceAccount,
            ...(accessToken && { accessToken }),
        });
        setInstallItem(undefined);
    };

    const onDeleteConfirm = async () => {
        const item = deleteItem();
        if (!item) return;
        await deleteMcp({ id: item.id, name: item.name });
        setDeleteItem(undefined);
        if (selectedId() === item.id) {
            setSelectedId(undefined);
        }
    };

    return (
        <div class={styles.root} data-label="MCP registry">
            <Show when={props.pending}>
                <p data-label="Loading">Loading</p>
            </Show>

            <Show when={!props.pending && props.error}>
                <Alert variant="destructive" data-label="Error">Failed to load catalog</Alert>
            </Show>

            <Show when={!props.pending && !props.error && (!props.catalog || props.catalog.length === 0)}>
                <p data-label="Empty">No catalog items</p>
            </Show>

            <Show when={!props.pending && !props.error && props.catalog && props.catalog.length > 0}>
                <div class={styles.tabbed} data-label="Catalog">
                    <div class={styles["tab-list"]} data-label="MCP list">
                        <div class={styles.tab} data-label="Add MCP card">
                            <AddMcpCard onClick={props.onAddClick} />
                        </div>
                        <For each={props.catalog}>
                            {(item) => (
                                <div
                                    class={styles.tab}
                                    classList={{ [styles.selected]: selectedId() === item.id }}
                                    onClick={() => setSelectedId(item.id)}
                                    data-label={`MCP: ${item.name}`}
                                >
                                    <McpCard
                                        item={item}
                                        instances={getInstances(item.id)}
                                        onInstall={() => setInstallItem(item)}
                                        onDelete={() => setDeleteItem(item)}
                                        onLogs={() => setLogsItem(item)}
                                    />
                                </div>
                            )}
                        </For>
                    </div>
                    <Show when={!selectedMcp()}>
                        <Empty class={styles["empty-tools"]} data-label="Empty tools">
                            <EmptyDescription>Select server to see tools</EmptyDescription>
                        </Empty>
                    </Show>
                    <Show when={selectedMcp()}>
                        <div class={styles["tab-content"]} data-label="Tools content">
                            <Show when={getInstances(selectedId()!).length === 0}>
                                <Empty data-label="Not installed">
                                    <EmptyDescription>
                                        This server is not installed yet. Install it to discover available tools.
                                    </EmptyDescription>
                                    <Button variant="success" onClick={() => setInstallItem(selectedMcp()!)}>
                                        Install server
                                    </Button>
                                </Empty>
                            </Show>
                            <Show when={getInstances(selectedId()!).length > 0}>
                                <ToolTable
                                    tools={tools}
                                    agents={() => agents() ?? []}
                                    callPolicies={() => callPolicies() ?? []}
                                    resultPolicies={() => resultPolicies() ?? []}
                                    error={toolsQuery.error}
                                    pending={toolsQuery.pending}
                                    columns={["name", "assignments", "call-policy", "result-policy"]}
                                />
                            </Show>
                        </div>
                    </Show>
                </div>
            </Show>

            <Show when={installItem()}>
                <McpInstallDialog
                    onClose={() => setInstallItem(undefined)}
                    catalogItem={installItem()!}
                    installing={installSubmission.pending}
                    onInstall={onInstallSubmit}
                />
            </Show>

            <Show when={deleteItem()}>
                <McpDeleteDialog
                    item={deleteItem()}
                    installationCount={getInstances(deleteItem()!.id).length}
                    deleting={deleteSubmission.pending}
                    onClose={() => setDeleteItem(undefined)}
                    onConfirm={onDeleteConfirm}
                />
            </Show>

            <Show when={logsItem()}>
                <McpLogsDialog
                    serverName={logsItem()!.name}
                    installs={getInstances(logsItem()!.id).map((server) => ({
                        id: server.id,
                        name: server.ownerEmail ?? server.teamDetails?.name ?? "Unknown",
                    }))}
                    onClose={() => setLogsItem(undefined)}
                />
            </Show>
        </div>
    );
}
