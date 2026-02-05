import { Tabs } from "@kobalte/core/tabs";
import { createSignal, For, Show } from "solid-js";
import { AddMcpCard } from "./AddMcpCard";
import { McpCard } from "./McpCard";
import { McpInstallationsDialog } from "./McpInstallationsDialog";
import { LocalServerInstallDialog } from "./LocalServerInstallDialog";
import { RemoteServerInstallDialog } from "./RemoteServerInstallDialog";
import { NoAuthInstallDialog } from "./NoAuthInstallDialog";
import { ToolTable } from "../tools/ToolTable";
import { Alert } from "../primitives/Alert";
import { Button } from "../primitives/Button";
import { Empty, EmptyDescription } from "../primitives/Empty";
import { useTools } from "@/lib/tool.query";
import { useAgents } from "@/lib/agent.query";
import { useToolCallPolicies, useResultPolicies } from "@/lib/policy.query";
import { useMcpServers } from "@/lib/mcp-registry.query";
import { useInstallMcpServer } from "@/lib/mcp-server.query";
import type { MCP, LocalServerInstallResult, RemoteServerInstallResult, NoAuthInstallResult } from "@/types";
import styles from "./McpRegistry.module.css";

export function McpRegistry(props: {
    catalog: MCP[] | undefined;
    error?: boolean;
    pending?: boolean;
    onAddClick?: () => void;
}) {
    const { data: mcpServers } = useMcpServers();
    const { submit: installServer, submission: installSubmission } = useInstallMcpServer();

    const getInstances = (catalogId: string) => {
        return (mcpServers() ?? []).filter((server) => server.catalogId === catalogId);
    };

    const [selectedId, setSelectedId] = createSignal<string | undefined>(undefined);
    const [installationsDialogMcpId, setInstallationsDialogMcpId] = createSignal<string | undefined>(undefined);

    // Install dialog state
    const [localInstallItem, setLocalInstallItem] = createSignal<MCP | null>(null);
    const [remoteInstallItem, setRemoteInstallItem] = createSignal<MCP | null>(null);
    const [noAuthInstallItem, setNoAuthInstallItem] = createSignal<MCP | null>(null);

    const selectedMcp = () => props.catalog?.find((item) => item.id === selectedId());
    const installationsDialogMcp = () => props.catalog?.find((item) => item.id === installationsDialogMcpId());

    const { data: allTools, query: toolsQuery } = useTools({ limit: 100, offset: 0 });
    const { data: agents } = useAgents();
    const { data: callPolicies } = useToolCallPolicies();
    const { data: resultPolicies } = useResultPolicies();

    const tools = () => {
        const selected = selectedId();
        if (!selected) return [];
        return (allTools() ?? []).filter((tool) => tool.catalogId === selected);
    };

    const onInstall = (item: MCP) => {
        if (item.serverType === "local") {
            setLocalInstallItem(item);
        } else if (item.serverType === "remote") {
            const hasUserConfig = item.userConfig && Object.keys(item.userConfig).length > 0;
            const hasAuth = item.authMethod !== "none" || item.oauthConfig || hasUserConfig;
            if (hasAuth || hasUserConfig) {
                setRemoteInstallItem(item);
            } else {
                setNoAuthInstallItem(item);
            }
        }
    };

    const onLocalInstall = async (result: LocalServerInstallResult) => {
        const item = localInstallItem();
        if (!item) return;
        await installServer({
            name: item.name,
            catalogId: item.id,
            environmentValues: result.environmentValues,
            teamId: result.teamId ?? undefined,
            serviceAccount: result.serviceAccount,
        });
        setLocalInstallItem(null);
    };

    const onRemoteInstall = async (catalogItem: MCP, result: RemoteServerInstallResult) => {
        const accessToken =
            result.metadata?.access_token && typeof result.metadata.access_token === "string"
                ? result.metadata.access_token
                : undefined;

        await installServer({
            name: catalogItem.name,
            catalogId: catalogItem.id,
            ...(accessToken && { accessToken }),
            teamId: result.teamId ?? undefined,
        });
        setRemoteInstallItem(null);
    };

    const onNoAuthInstall = async (result: NoAuthInstallResult) => {
        const item = noAuthInstallItem();
        if (!item) return;
        await installServer({
            name: item.name,
            catalogId: item.id,
            teamId: result.teamId ?? undefined,
        });
        setNoAuthInstallItem(null);
    };

    return (
        <div class={styles.root}>
            <Show when={props.pending}>
                <p>Loading</p>
            </Show>

            <Show when={props.error}>
                <Alert variant="destructive">Failed to load catalog</Alert>
            </Show>

            <Show when={props.catalog && props.catalog.length === 0}>
                <p>No catalog items</p>
            </Show>

            <Show when={props.catalog && props.catalog.length > 0}>
                <Tabs class={styles.tabbed} orientation="vertical" value={selectedId()} onChange={setSelectedId}>
                    <Tabs.List class={styles["tab-list"]}>
                        <Tabs.Trigger as="div" class={styles.tab}>
                            <AddMcpCard onClick={props.onAddClick} />
                        </Tabs.Trigger>
                        <For each={props.catalog}>
                            {(item) => (
                                <Tabs.Trigger as="div" value={item.id} class={styles.tab}>
                                    <McpCard
                                        item={item}
                                        instances={getInstances(item.id)}
                                        onInstall={() => onInstall(item)}
                                        onManageInstallations={() => setInstallationsDialogMcpId(item.id)}
                                    />
                                </Tabs.Trigger>
                            )}
                        </For>
                    </Tabs.List>
                    <Show when={!selectedMcp()}>
                        <Empty class={styles["empty-tools"]}>
                            <EmptyDescription>Select server to see tools</EmptyDescription>
                        </Empty>
                    </Show>
                    <For each={props.catalog}>
                        {(item) => (
                            <Tabs.Content value={item.id} class={styles["tab-content"]}>
                                <Show when={getInstances(item.id).length === 0}>
                                    <Empty>
                                        <EmptyDescription>
                                            This server is not installed yet. Install it to discover available tools.
                                        </EmptyDescription>
                                        <Button variant="success" onClick={() => onInstall(item)}>
                                            Install server
                                        </Button>
                                    </Empty>
                                </Show>
                                <Show when={getInstances(item.id).length > 0}>
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
                            </Tabs.Content>
                        )}
                    </For>
                </Tabs>
            </Show>

            <McpInstallationsDialog
                open={Boolean(installationsDialogMcpId())}
                onOpenChange={(open) => !open && setInstallationsDialogMcpId(undefined)}
                serverName={installationsDialogMcp()?.name ?? ""}
                instances={getInstances(installationsDialogMcpId() ?? "")}
                onInstall={() => {
                    const mcp = installationsDialogMcp();
                    if (mcp) onInstall(mcp);
                }}
            />

            <LocalServerInstallDialog
                open={Boolean(localInstallItem())}
                onOpenChange={(open) => { if (!open) setLocalInstallItem(null); }}
                catalogItem={localInstallItem()}
                installing={installSubmission.pending}
                onInstall={onLocalInstall}
            />

            <RemoteServerInstallDialog
                open={Boolean(remoteInstallItem())}
                onOpenChange={(open) => { if (!open) setRemoteInstallItem(null); }}
                catalogItem={remoteInstallItem()}
                installing={installSubmission.pending}
                onInstall={onRemoteInstall}
            />

            <NoAuthInstallDialog
                open={Boolean(noAuthInstallItem())}
                onOpenChange={(open) => { if (!open) setNoAuthInstallItem(null); }}
                catalogItem={noAuthInstallItem()}
                installing={installSubmission.pending}
                onInstall={onNoAuthInstall}
            />
        </div>
    );
}
