import { useNavigate, useSearchParams } from "@solidjs/router";
import { createMemo, createSignal, For, Show } from "solid-js";
import { useAgents, useAssignTool } from "@/lib/agent.query";
import { useDeleteMcp, useMcpServers } from "@/lib/mcp-registry.query";
import { useDeleteMcpServer, useInstallMcpServer } from "@/lib/mcp-server.query";
import { useResultPolicies, useToolCallPolicies } from "@/lib/policy.query";
import { useTools, useUnassignTool } from "@/lib/tool.query";
import type { MCP } from "@/types";
import { Alert } from "../primitives/Alert";
import { Button } from "../primitives/Button";
import { Empty, EmptyDescription } from "../primitives/Empty";
import { AgentAssignmentTabs } from "../tools/AgentAssignmentTabs";
import { ToolTable } from "../tools/ToolTable";
import { AddMcpCard } from "./AddMcpCard";
import { ClaudeCodeCard } from "./ClaudeCodeCard";
import { McpAboutDialog } from "./McpAboutDialog";
import { McpCard } from "./McpCard";
import { McpDeleteDialog } from "./McpDeleteDialog";
import { McpEditDialog } from "./McpEditDialog";
import { McpInstallDialog } from "./McpInstallDialog";
import { McpLogsDialog } from "./McpLogsDialog";
import { McpManageInstancesDialog } from "./McpManageInstancesDialog";
import styles from "./McpRegistry.module.css";

const CLAUDE_CODE_VIRTUAL_ID = "virtual:claude-code";

export function McpRegistry(props: {
    catalog: MCP[] | undefined;
    error?: boolean;
    pending?: boolean;
    onAddClick?: () => void;
}) {
    const navigate = useNavigate();
    const { data: mcpServers } = useMcpServers();
    const { submit: installServer, submission: installSubmission } = useInstallMcpServer();
    const { submit: deleteMcp, submission: deleteSubmission } = useDeleteMcp();
    const { submit: uninstallServer } = useDeleteMcpServer();

    const getInstances = (catalogId: string) => {
        return (mcpServers() ?? []).filter((server) => server.catalogId === catalogId);
    };

    const [searchParams, setSearchParams] = useSearchParams();

    const selectedId = () => {
        const id = searchParams.selected;
        if (!id || !props.catalog) return undefined;
        if (id === CLAUDE_CODE_VIRTUAL_ID) return id;
        const exists = props.catalog.some((item) => item.id === id);
        return exists ? id : undefined;
    };

    const isVirtualSelected = () => selectedId() === CLAUDE_CODE_VIRTUAL_ID;

    const setSelectedId = (id: string | undefined) => {
        setSearchParams({ selected: id });
    };

    const [installItem, setInstallItem] = createSignal<MCP | undefined>(undefined, { name: "installItem" });
    const [deleteItem, setDeleteItem] = createSignal<MCP | undefined>(undefined, { name: "deleteItem" });
    const [logsItem, setLogsItem] = createSignal<MCP | undefined>(undefined, { name: "logsItem" });
    const [aboutServerName, setAboutServerName] = createSignal<string | undefined>(undefined, { name: "aboutServerName" });
    const [manageInstancesItem, setManageInstancesItem] = createSignal<MCP | undefined>(undefined, { name: "manageInstancesItem" });
    const [editItem, setEditItem] = createSignal<MCP | undefined>(undefined, { name: "editItem" });

    const selectedMcp = () => props.catalog?.find((item) => item.id === selectedId());

    const { data: allTools, query: toolsQuery } = useTools({ limit: 100, offset: 0 });
    const { data: agents } = useAgents();
    const { data: callPolicies } = useToolCallPolicies();
    const { data: resultPolicies } = useResultPolicies();

    const [selectedAgentId, setSelectedAgentId] = createSignal<string | undefined>(undefined, { name: "selectedAgentId" });
    const assignTool = useAssignTool();
    const unassignTool = useUnassignTool();

    const toolTableColumns = createMemo(() =>
        selectedAgentId()
            ? (["select", "name", "assignments"] as ("select" | "name" | "assignments")[])
            : (["select", "name", "assignments", "call-policy", "result-policy", "edit"] as (
                  | "select"
                  | "name"
                  | "assignments"
                  | "call-policy"
                  | "result-policy"
                  | "edit"
              )[]),
    );

    const regularCatalog = () => (props.catalog ?? []).filter((item) => item.serverType !== "builtin");
    const builtinCatalog = () => (props.catalog ?? []).filter((item) => item.serverType === "builtin");

    const autoDiscoveredTools = () =>
        (allTools() ?? []).filter(
            (tool) => !tool.catalogId && !tool.mcpServerName && !tool.name.startsWith("archestra__"),
        );

    const hasAutoDiscoveredTools = () => autoDiscoveredTools().length > 0;

    const tools = () => {
        const selected = selectedId();
        if (!selected) return [];
        if (selected === CLAUDE_CODE_VIRTUAL_ID) return autoDiscoveredTools();
        return (allTools() ?? []).filter((tool) => tool.catalogId === selected);
    };

    const initialSelectedIds = createMemo(() => {
        const agentId = selectedAgentId();
        if (!agentId) return undefined;
        const currentTools = selectedId() && isVirtualSelected() ? autoDiscoveredTools() : tools();
        return new Set(
            currentTools.filter((tool) => tool.assignments.some((a) => a.agent.id === agentId)).map((tool) => tool.id),
        );
    });

    function handleSelectionChange(nextIds: Set<string>) {
        const agentId = selectedAgentId();
        if (!agentId) return;
        const currentIds = initialSelectedIds() ?? new Set<string>();
        for (const toolId of nextIds) {
            if (!currentIds.has(toolId)) assignTool.submit({ agentId, toolId });
        }
        for (const toolId of currentIds) {
            if (!nextIds.has(toolId)) unassignTool.submit({ agentId, toolId });
        }
    }

    const onInstallSubmit = async (
        catalogItem: MCP,
        result: {
            teamId: string | undefined;
            environmentValues?: Record<string, string>;
            serviceAccount?: string;
            metadata?: Record<string, unknown>;
        },
    ) => {
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

    const onUninstallInstance = async (serverId: string) => {
        const servers = mcpServers() ?? [];
        const server = servers.find((s) => s.id === serverId);
        await uninstallServer({ id: serverId, name: server?.name ?? "" });
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
                <Alert variant="destructive" data-label="Error">
                    Failed to load catalog
                </Alert>
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
                        <For each={regularCatalog()}>
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
                                        onUninstall={onUninstallInstance}
                                        onDelete={() => setDeleteItem(item)}
                                        onLogs={() => setLogsItem(item)}
                                        onAbout={() => setAboutServerName(item.name)}
                                        onEdit={() => setEditItem(item)}
                                        onManageInstallations={() => setManageInstancesItem(item)}
                                    />
                                </div>
                            )}
                        </For>
                        <Show when={hasAutoDiscoveredTools()}>
                            <div
                                class={styles.tab}
                                classList={{ [styles.selected]: isVirtualSelected() }}
                                onClick={() => setSelectedId(CLAUDE_CODE_VIRTUAL_ID)}
                                data-label="MCP: Claude Code"
                            >
                                <ClaudeCodeCard />
                            </div>
                        </Show>
                        <For each={builtinCatalog()}>
                            {(item) => (
                                <div
                                    class={styles.tab}
                                    classList={{ [styles.selected]: selectedId() === item.id }}
                                    onClick={() => setSelectedId(item.id)}
                                    data-label={`MCP: ${item.name}`}
                                >
                                    <McpCard item={item} instances={getInstances(item.id)} />
                                </div>
                            )}
                        </For>
                    </div>
                    <Show when={!selectedMcp() && !isVirtualSelected()}>
                        <Empty class={styles["empty-tools"]} data-label="Empty tools">
                            <EmptyDescription>Select server to see tools</EmptyDescription>
                        </Empty>
                    </Show>
                    <Show when={isVirtualSelected()}>
                        <div class={styles["tab-content"]} data-label="Tools content">
                            <AgentAssignmentTabs
                                agents={agents}
                                tools={autoDiscoveredTools}
                                selectedAgentId={selectedAgentId()}
                                onSelect={setSelectedAgentId}
                            />
                            <ToolTable
                                tools={autoDiscoveredTools}
                                agents={() => agents() ?? []}
                                callPolicies={() => callPolicies() ?? []}
                                resultPolicies={() => resultPolicies() ?? []}
                                error={toolsQuery.error}
                                pending={toolsQuery.pending}
                                columns={toolTableColumns()}
                                initialSelectedIds={initialSelectedIds}
                                onSelectionChange={handleSelectionChange}
                                selectedAgentId={selectedAgentId()}
                                onToolClick={(toolId) => navigate(`/tools/${toolId}`)}
                            />
                        </div>
                    </Show>
                    <Show when={selectedMcp() && !isVirtualSelected()}>
                        <div class={styles["tab-content"]} data-label="Tools content">
                            <Show
                                when={
                                    selectedMcp()?.serverType !== "builtin" && getInstances(selectedId()!).length === 0
                                }
                            >
                                <Empty data-label="Not installed" class={styles["empty-content"]}>
                                    <EmptyDescription>
                                        This server is not installed yet. Install it to discover available tools.
                                    </EmptyDescription>
                                    <Button variant="muted" size="large" onClick={() => setInstallItem(selectedMcp()!)}>
                                        Install server
                                    </Button>
                                </Empty>
                            </Show>
                            <Show
                                when={selectedMcp()?.serverType === "builtin" || getInstances(selectedId()!).length > 0}
                            >
                                <AgentAssignmentTabs
                                    agents={agents}
                                    tools={tools}
                                    selectedAgentId={selectedAgentId()}
                                    onSelect={setSelectedAgentId}
                                />
                                <ToolTable
                                    tools={tools}
                                    agents={() => agents() ?? []}
                                    callPolicies={() => callPolicies() ?? []}
                                    resultPolicies={() => resultPolicies() ?? []}
                                    error={toolsQuery.error}
                                    pending={toolsQuery.pending}
                                    columns={toolTableColumns()}
                                    initialSelectedIds={initialSelectedIds}
                                    onSelectionChange={handleSelectionChange}
                                    selectedAgentId={selectedAgentId()}
                                    onToolClick={(toolId) => navigate(`/tools/${toolId}`)}
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

            <Show when={aboutServerName()}>
                <McpAboutDialog serverName={aboutServerName()!} onClose={() => setAboutServerName(undefined)} />
            </Show>

            <Show when={editItem()}>
                <McpEditDialog item={editItem()!} onClose={() => setEditItem(undefined)} />
            </Show>

            <Show when={manageInstancesItem()}>
                <McpManageInstancesDialog
                    serverName={manageInstancesItem()!.name}
                    instances={getInstances(manageInstancesItem()!.id)}
                    onClose={() => setManageInstancesItem(undefined)}
                    onUninstall={onUninstallInstance}
                    onInstall={() => {
                        const item = manageInstancesItem();
                        setManageInstancesItem(undefined);
                        if (item) setInstallItem(item);
                    }}
                />
            </Show>
        </div>
    );
}
