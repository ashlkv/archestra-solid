import { Tabs } from "@kobalte/core/tabs";
import { createSignal, For, Show } from "solid-js";
import { AddMcpCard } from "./AddMcpCard";
import { McpCard } from "./McpCard";
import { McpInstallationsDialog } from "./McpInstallationsDialog";
import { ToolTable } from "../tools/ToolTable";
import { Alert } from "../primitives/Alert";
import { Button } from "../primitives/Button";
import { Empty, EmptyDescription } from "../primitives/Empty";
import { useTools } from "@/lib/tool.query";
import { useAgents } from "@/lib/agent.query";
import { useToolCallPolicies, useResultPolicies } from "@/lib/policy.query";
import { useMcpServers } from "@/lib/mcp-registry.query";
import type { MCP } from "@/types";
import styles from "./McpRegistry.module.css";

export function McpRegistry(props: {
    catalog: MCP[] | undefined;
    error?: boolean;
    pending?: boolean;
    onAddClick?: () => void;
    onInstall?: (mcp: MCP) => void;
}) {
    const { data: mcpServers } = useMcpServers();
    const getInstances = (catalogId: string) => {
        return (mcpServers() ?? []).filter((server) => server.catalogId === catalogId);
    };
    const [selectedId, setSelectedId] = createSignal<string | undefined>(undefined);
    const [installationsDialogMcpId, setInstallationsDialogMcpId] = createSignal<string | undefined>(undefined);

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
                                        onInstall={() => props.onInstall?.(item)}
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
                                        <Button variant="success" onClick={() => props.onInstall?.(item)}>
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
                    if (mcp) props.onInstall?.(mcp);
                }}
            />
        </div>
    );
}
