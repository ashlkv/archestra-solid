import { createEffect, createSignal, For, type JSX, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { Check, ExternalLink } from "@/icons";
import { OriginBadge } from "@/common/OriginBadge";
import { getIcon } from "@/mcp-icons";
import { Button } from "@/primitives/Button";
import { Checkbox } from "@/primitives/Checkbox";
import { ExpandCollapseButton } from "@/primitives/ExpandCollapseButton";
import { ExpandCollapseTransition } from "@/primitives/ExpandCollapseTransition";
import { Popover, PopoverContent, PopoverTrigger } from "@/primitives/Popover";
import { Table, TableBody, TableCell, TableRow } from "@/primitives/Table";
import { ToolHoverCard } from "@/tools/components/ToolHoverCard";
import { useAssignTool, useUnassignToolFromAgent } from "@/lib/agent.query";
import { fetchCatalogTools, useCatalogTools, useMcpRegistry } from "@/mcp-registry/mcp-registry.query";
import type { AgentDetail, CatalogTool, MCP } from "@/types";
import styles from "./AgentToolsEditor.module.css";

type AgentTool = AgentDetail["tools"][number];

export function AgentToolsEditor(props: {
    agentId: string;
    agentTools: AgentTool[];
    disabled?: boolean;
}): JSX.Element {
    const { data: catalog } = useMcpRegistry(undefined as undefined);
    const [expandedCatalogId, setExpandedCatalogId] = createSignal<string | undefined>(undefined, {
        name: "expandedCatalog",
    });
    const [pinnedCatalogIds, setPinnedCatalogIds] = createSignal<Set<string>>(new Set(), {
        name: "pinnedCatalogs",
    });

    // Pin catalogs that have assigned tools so they persist even when all tools are deselected
    createEffect(() => {
        const ids = new Set<string>();
        for (const tool of props.agentTools) {
            if (tool.catalogId) ids.add(tool.catalogId);
        }
        if (ids.size > 0) {
            setPinnedCatalogIds((prev) => {
                const next = new Set(prev);
                for (const id of ids) next.add(id);
                return next;
            });
        }
    });

    const toolsByCatalog = () => {
        const grouped: Record<string, AgentTool[]> = {};
        for (const tool of props.agentTools) {
            const key = tool.catalogId ?? "unknown";
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(tool);
        }
        return grouped;
    };

    const assignedCatalogs = () => {
        const catalogItems = catalog() ?? [];
        const groups = toolsByCatalog();
        const pinned = pinnedCatalogIds();
        return catalogItems
            .filter((item) => (groups[item.id]?.length) || pinned.has(item.id))
            .sort((a, b) => (groups[b.id]?.length ?? 0) - (groups[a.id]?.length ?? 0));
    };

    const toggleCatalog = (catalogId: string) => {
        setExpandedCatalogId((previous) => (previous === catalogId ? undefined : catalogId));
    };

    return (
        <div class={styles.container} data-label="Agent tools editor">
            <Show when={assignedCatalogs().length > 0}>
                <Table style={{ "min-width": "0" }}>
                    <For each={assignedCatalogs()}>
                        {(catalogItem) => (
                            <McpServerRow
                                agentId={props.agentId}
                                catalogItem={catalogItem}
                                assignedTools={toolsByCatalog()[catalogItem.id] ?? []}
                                expanded={catalogItem.id === expandedCatalogId()}
                                onToggle={() => toggleCatalog(catalogItem.id)}
                                disabled={props.disabled}
                            />
                        )}
                    </For>
                </Table>
            </Show>
            <Show when={!props.disabled}>
                <AddMcpServerDropdown
                    agentId={props.agentId}
                    agentTools={props.agentTools}
                />
            </Show>
        </div>
    );
}

// ---------------------------------------------------------------------------
// McpServerRow — expandable table row for an MCP server
// ---------------------------------------------------------------------------

function McpServerRow(props: {
    agentId: string;
    catalogItem: MCP;
    assignedTools: AgentTool[];
    expanded: boolean;
    onToggle: () => void;
    disabled?: boolean;
}): JSX.Element {
    const { data: catalogTools } = useCatalogTools(() => props.catalogItem.id);
    const { submit: assignTool } = useAssignTool();
    const { submit: unassignTool } = useUnassignToolFromAgent();

    const allTools = () => (catalogTools() as CatalogTool[] | undefined) ?? [];
    const assignedToolIds = () => new Set(props.assignedTools.map((t) => t.id));

    const sortedTools = () => [...allTools()].sort((a, b) => a.name.localeCompare(b.name));

    const onToggleTool = async (tool: CatalogTool) => {
        if (assignedToolIds().has(tool.id)) {
            await unassignTool({ agentId: props.agentId, toolId: tool.id });
        } else {
            await assignTool({ agentId: props.agentId, toolId: tool.id });
        }
    };

    const onSelectAll = async () => {
        const assigned = assignedToolIds();
        await Promise.all(
            allTools()
                .filter((tool) => !assigned.has(tool.id))
                .map((tool) => assignTool({ agentId: props.agentId, toolId: tool.id })),
        );
    };

    const onDeselectAll = async () => {
        await Promise.all(
            props.assignedTools.map((tool) => unassignTool({ agentId: props.agentId, toolId: tool.id })),
        );
    };

    const selectedCount = () => allTools().filter((t) => assignedToolIds().has(t.id)).length;
    const totalCount = () => allTools().length;

    const allSelected = () => totalCount() > 0 && selectedCount() === totalCount();
    const someSelected = () => selectedCount() > 0 && selectedCount() < totalCount();

    const onToggleAll = async () => {
        if (allSelected()) {
            await onDeselectAll();
        } else {
            await onSelectAll();
        }
    };

    const toolCountLabel = () => {
        const selected = selectedCount();
        const total = totalCount();
        const suffix = total === 1 ? "tool" : "tools";
        if (total === 0) return `${props.assignedTools.length} ${suffix}`;
        if (selected === total) return `all ${total} ${suffix}`;
        if (selected === 0) return `none of ${total} ${suffix}`;
        return `${selected} of ${total} ${suffix}`;
    };

    return (
        <TableBody>
            <TableRow onClick={props.onToggle} current={props.expanded}>
                <TableCell data-label={`MCP: ${props.catalogItem.name}`} class={styles["server-row-cell"]}>
                    <ExpandCollapseButton
                        expanded={props.expanded}
                        onClick={props.onToggle}
                        size={14}
                    />
                    <Show when={props.expanded && !props.disabled}>
                        <span onClick={(event) => event.stopPropagation()}>
                            <Checkbox
                                checked={allSelected()}
                                indeterminate={someSelected()}
                                onChange={onToggleAll}
                            />
                        </span>
                    </Show>
                    <OriginBadge
                        toolName={props.assignedTools[0]?.name ?? ""}
                        mcpServerName={props.catalogItem.name}
                        size="medium"
                    />
                    <span class={styles["tool-count"]}>
                        {toolCountLabel()}
                    </span>
                </TableCell>
            </TableRow>
            <ExpandCollapseTransition
                when={props.expanded}
                wrapperSelector=":scope > td > div"
            >
                <tr>
                    <td style={{ padding: 0, border: "none" }}>
                        <div style={{ overflow: "hidden" }}>
                            <Table class={styles["expanded-table"]}>
                                <TableBody>
                                    <For each={sortedTools()}>
                                        {(tool) => {
                                            const isSelected = () => assignedToolIds().has(tool.id);

                                            return (
                                                <TableRow
                                                    onClick={() => { if (!props.disabled) onToggleTool(tool); }}
                                                    data-label={`Tool: ${tool.name}`}
                                                >
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={isSelected()}
                                                            class={styles["tool-checkbox"]}
                                                            disabled={props.disabled}
                                                        />
                                                        <ToolHoverCard
                                                            name={shortToolName(tool.name)}
                                                            description={tool.description}
                                                            parameters={tool.parameters as any}
                                                        >
                                                            <span class={styles["tool-name"]}>{shortToolName(tool.name)}</span>
                                                        </ToolHoverCard>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        }}
                                    </For>
                                </TableBody>
                            </Table>
                        </div>
                    </td>
                </tr>
            </ExpandCollapseTransition>
        </TableBody>
    );
}

// ---------------------------------------------------------------------------
// AddMcpServerDropdown
// ---------------------------------------------------------------------------

function AddMcpServerDropdown(props: {
    agentId: string;
    agentTools: AgentTool[];
}): JSX.Element {
    const { data: catalog } = useMcpRegistry(undefined as undefined);
    const { submit: assignTool } = useAssignTool();
    const { submit: unassignTool } = useUnassignToolFromAgent();
    const [open, setOpen] = createSignal(false, { name: "addDropdownOpen" });

    const assignedCatalogIds = () => {
        const ids = new Set<string>();
        for (const tool of props.agentTools) {
            if (tool.catalogId) ids.add(tool.catalogId);
        }
        return ids;
    };

    const catalogItems = () => catalog() ?? [];

    const onToggleServer = async (catalogId: string) => {
        const isAssigned = assignedCatalogIds().has(catalogId);
        if (isAssigned) {
            const toolsToRemove = props.agentTools.filter((t) => t.catalogId === catalogId);
            await Promise.all(toolsToRemove.map((t) => unassignTool({ agentId: props.agentId, toolId: t.id })));
        } else {
            const tools = await fetchCatalogTools(catalogId);
            await Promise.all(
                tools.map((t: CatalogTool) => assignTool({ agentId: props.agentId, toolId: t.id })),
            );
        }
    };

    return (
        <Popover open={open()} onOpenChange={setOpen}>
            <PopoverTrigger>
                <Button variant="outline" data-label="Add MCP server">
                    Add or remove MCP server
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <div class={styles["dropdown-body"]}>
                    <Show when={catalogItems().length === 0}>
                        <div class={styles["empty-state"]}>No MCP servers found.</div>
                    </Show>

                    <div class={styles["server-grid"]}>
                        <For each={catalogItems()}>
                            {(item) => {
                                const isAssigned = () => assignedCatalogIds().has(item.id);
                                const assignedCount = () =>
                                    props.agentTools.filter((t) => t.catalogId === item.id).length;

                                return (
                                    <div
                                        class={`${styles["server-card"]} ${isAssigned() ? styles["server-card-active"] : ""}`}
                                        onClick={() => onToggleServer(item.id)}
                                        data-label={`Server: ${item.name}`}
                                    >
                                        <div class={styles["server-card-header"]}>
                                            <Dynamic component={getIcon(item.name)} size={20} class={styles["server-card-icon"]} />
                                            <span class={styles["server-card-name"]}>{item.name}</span>
                                            <Show when={isAssigned()}>
                                                <Check size={14} class={styles["server-card-check"]} />
                                            </Show>
                                        </div>
                                        <Show when={item.description}>
                                            <p class={styles["server-card-description"]}>{item.description}</p>
                                        </Show>
                                        <Show when={isAssigned()}>
                                            <span class={styles["server-card-count"]}>{assignedCount()} tools</span>
                                        </Show>
                                    </div>
                                );
                            }}
                        </For>
                    </div>

                    <a href="/mcp-catalog/registry" class={styles["install-link"]} data-label="Install new MCP server">
                        <span>Install new MCP server</span>
                        <ExternalLink size={14} />
                    </a>
                </div>
            </PopoverContent>
        </Popover>
    );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function shortToolName(name: string): string {
    const lastSep = name.lastIndexOf("__");
    return lastSep !== -1 ? name.slice(lastSep + 2) : name;
}
