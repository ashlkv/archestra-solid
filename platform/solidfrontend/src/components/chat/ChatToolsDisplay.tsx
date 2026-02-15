import {
    ARCHESTRA_MCP_SERVER_NAME,
    DEFAULT_ARCHESTRA_TOOL_NAMES,
    isAgentTool,
    MCP_SERVER_TOOL_NAME_SEPARATOR,
} from "@shared";
import { createEffect, createSignal, For, type JSX, on, Show } from "solid-js";
import { Loader2, Plus, X } from "@/components/icons";
import { Button } from "@/components/primitives/Button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/primitives/Dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/primitives/Popover";
import {
    useConversationEnabledTools,
    useGlobalChatTools,
    useProfileToolsWithIds,
    useUpdateConversationEnabledTools,
} from "@/lib/chat-tools.query";
import {
    addPendingAction,
    applyPendingActions,
    getPendingActions,
    type PendingToolAction,
} from "@/lib/pending-tool-state";
import type { ChatToolItem } from "@/types";
import styles from "./ChatToolsDisplay.module.css";

export function ChatToolsDisplay(props: { agentId: string; conversationId?: string }): JSX.Element {
    const { data: profileToolsData, query: profileQuery } = useProfileToolsWithIds(() => props.agentId);
    const { data: globalToolsData, query: globalQuery } = useGlobalChatTools(undefined as undefined);
    const { data: enabledToolsData } = useConversationEnabledTools(() => props.conversationId ?? "");
    const { submit: updateEnabledTools } = useUpdateConversationEnabledTools();

    const [pendingActions, setPendingActions] = createSignal<PendingToolAction[]>([]);
    const [addToolsOpen, setAddToolsOpen] = createSignal(false);

    const isLoading = () => profileQuery.pending || globalQuery.pending;

    // Load pending actions when context changes
    createEffect(
        on(
            () => [props.agentId, props.conversationId] as const,
            ([agentId, conversationId]) => {
                if (!conversationId) {
                    setPendingActions(getPendingActions(agentId));
                } else {
                    setPendingActions([]);
                }
            },
        ),
    );

    // Merge profile + global tools, excluding agent delegation tools
    const allTools = (): ChatToolItem[] => {
        const profileTools = (profileToolsData() ?? []).filter((t) => !isAgentTool(t.name));
        const profileIds = new Set(profileTools.map((t) => t.id));
        const globalTools = (globalToolsData() ?? []).filter((t) => !profileIds.has(t.id));
        return [...profileTools, ...globalTools];
    };

    // Default enabled tools logic
    const defaultEnabledToolIds = (): string[] => {
        const profileDefaults = (profileToolsData() ?? [])
            .filter((t) => !t.name.startsWith("archestra__") || DEFAULT_ARCHESTRA_TOOL_NAMES.includes(t.name))
            .map((t) => t.id);
        const globalDefaults = (globalToolsData() ?? []).map((t) => t.id);
        return [...profileDefaults, ...globalDefaults];
    };

    // Compute current enabled tool IDs
    const currentEnabledToolIds = (): string[] => {
        const data = enabledToolsData();
        if (props.conversationId && data?.hasCustomSelection) {
            return data.enabledToolIds;
        }
        const base = defaultEnabledToolIds();
        if (!props.conversationId && pendingActions().length > 0) {
            return applyPendingActions(base, pendingActions());
        }
        return base;
    };

    const enabledSet = () => new Set(currentEnabledToolIds());

    // Group tools by MCP server name
    const serverGroups = (): Array<{ serverName: string; tools: ChatToolItem[] }> => {
        const grouped: Record<string, ChatToolItem[]> = {};
        for (const tool of allTools()) {
            const parts = tool.name.split(MCP_SERVER_TOOL_NAME_SEPARATOR);
            const serverName = parts.length > 1 ? parts.slice(0, -1).join(MCP_SERVER_TOOL_NAME_SEPARATOR) : "default";
            if (!grouped[serverName]) grouped[serverName] = [];
            grouped[serverName].push(tool);
        }
        return Object.entries(grouped)
            .sort(([a], [b]) => {
                if (a === ARCHESTRA_MCP_SERVER_NAME) return -1;
                if (b === ARCHESTRA_MCP_SERVER_NAME) return 1;
                return a.localeCompare(b);
            })
            .map(([serverName, tools]) => ({ serverName, tools }));
    };

    // Enable/disable handlers
    const handleEnableTool = (toolId: string) => {
        if (!props.conversationId) {
            const action: PendingToolAction = { type: "enable", toolId };
            addPendingAction(action, props.agentId);
            setPendingActions((prev) => [...prev, action]);
            return;
        }
        updateEnabledTools({ conversationId: props.conversationId, toolIds: [...currentEnabledToolIds(), toolId] });
    };

    const handleDisableTool = (toolId: string) => {
        if (!props.conversationId) {
            const action: PendingToolAction = { type: "disable", toolId };
            addPendingAction(action, props.agentId);
            setPendingActions((prev) => [...prev, action]);
            return;
        }
        updateEnabledTools({
            conversationId: props.conversationId,
            toolIds: currentEnabledToolIds().filter((id) => id !== toolId),
        });
    };

    const handleEnableAll = (toolIds: string[]) => {
        if (!props.conversationId) {
            const action: PendingToolAction = { type: "enableAll", toolIds };
            addPendingAction(action, props.agentId);
            setPendingActions((prev) => [...prev, action]);
            return;
        }
        updateEnabledTools({
            conversationId: props.conversationId,
            toolIds: [...new Set([...currentEnabledToolIds(), ...toolIds])],
        });
    };

    const handleDisableAll = (toolIds: string[]) => {
        if (!props.conversationId) {
            const action: PendingToolAction = { type: "disableAll", toolIds };
            addPendingAction(action, props.agentId);
            setPendingActions((prev) => [...prev, action]);
            return;
        }
        const toRemove = new Set(toolIds);
        updateEnabledTools({
            conversationId: props.conversationId,
            toolIds: currentEnabledToolIds().filter((id) => !toRemove.has(id)),
        });
    };

    return (
        <div class={styles.container} data-label="Chat tools display">
            <Show when={isLoading()}>
                <span class={styles.loading}>
                    <Loader2 size={12} class={styles.spinning} />
                    Loading tools...
                </span>
            </Show>

            <Show when={!isLoading() && allTools().length === 0}>
                <Dialog open={addToolsOpen()} onOpenChange={setAddToolsOpen}>
                    <DialogTrigger>
                        <button class={styles["add-tools-button"]} data-label="Add tools button">
                            <Plus size={14} />
                            <span>Add tools</span>
                        </button>
                    </DialogTrigger>
                    <DialogContent title="Add tools">
                        <div class={styles["empty-dialog"]}>
                            <p>Tool assignment coming soon.</p>
                            <p>Assign tools to this agent from the Tools page.</p>
                        </div>
                    </DialogContent>
                </Dialog>
            </Show>

            <Show when={!isLoading() && allTools().length > 0}>
                <For each={serverGroups()}>
                    {(group) => (
                        <ServerPill
                            serverName={group.serverName}
                            tools={group.tools}
                            enabledSet={enabledSet()}
                            onEnableTool={handleEnableTool}
                            onDisableTool={handleDisableTool}
                            onEnableAll={handleEnableAll}
                            onDisableAll={handleDisableAll}
                        />
                    )}
                </For>
            </Show>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Internal components
// ---------------------------------------------------------------------------

function ServerPill(props: {
    serverName: string;
    tools: ChatToolItem[];
    enabledSet: Set<string>;
    onEnableTool: (toolId: string) => void;
    onDisableTool: (toolId: string) => void;
    onEnableAll: (toolIds: string[]) => void;
    onDisableAll: (toolIds: string[]) => void;
}): JSX.Element {
    const [open, setOpen] = createSignal(false);

    const enabledTools = () => props.tools.filter((t) => props.enabledSet.has(t.id));
    const disabledTools = () => props.tools.filter((t) => !props.enabledSet.has(t.id));

    return (
        <Popover open={open()} onOpenChange={setOpen}>
            <PopoverTrigger>
                <button class={styles.pill} data-label={`Server: ${props.serverName}`}>
                    <span class={styles["pill-name"]}>{props.serverName}</span>
                    <span class={styles["pill-count"]}>
                        ({enabledTools().length}/{props.tools.length})
                    </span>
                </button>
            </PopoverTrigger>
            <PopoverContent>
                <div class={styles["popover-body"]}>
                    {/* Enabled section */}
                    <Show when={enabledTools().length > 0}>
                        <div class={styles["section-header"]}>
                            <span class={styles["section-label"]}>Enabled ({enabledTools().length})</span>
                            <button
                                class={styles["section-button"]}
                                onClick={() => props.onDisableAll(enabledTools().map((t) => t.id))}
                            >
                                Disable All
                            </button>
                        </div>
                        <div class={styles["tool-list"]}>
                            <For each={enabledTools()}>
                                {(tool) => (
                                    <ToolRow
                                        tool={tool}
                                        isDisabled={false}
                                        onToggle={() => props.onDisableTool(tool.id)}
                                    />
                                )}
                            </For>
                        </div>
                    </Show>

                    {/* Disabled section */}
                    <Show when={disabledTools().length > 0}>
                        <div class={styles["section-header"]}>
                            <span class={styles["section-label"]}>Disabled ({disabledTools().length})</span>
                            <button
                                class={styles["section-button"]}
                                onClick={() => props.onEnableAll(disabledTools().map((t) => t.id))}
                            >
                                Enable All
                            </button>
                        </div>
                        <div class={styles["tool-list"]}>
                            <For each={disabledTools()}>
                                {(tool) => (
                                    <ToolRow
                                        tool={tool}
                                        isDisabled={true}
                                        onToggle={() => props.onEnableTool(tool.id)}
                                    />
                                )}
                            </For>
                        </div>
                    </Show>
                </div>
            </PopoverContent>
        </Popover>
    );
}

function ToolRow(props: { tool: ChatToolItem; isDisabled: boolean; onToggle: () => void }): JSX.Element {
    const parts = props.tool.name.split(MCP_SERVER_TOOL_NAME_SEPARATOR);
    const toolName = parts.length > 1 ? parts[parts.length - 1] : props.tool.name;

    return (
        <div class={`${styles["tool-row"]} ${props.isDisabled ? styles.disabled : styles.enabled}`}>
            <span class={styles["tool-name"]}>{toolName}</span>
            <button
                class={`${styles["tool-action"]} ${props.isDisabled ? "" : styles.remove}`}
                onClick={(e) => {
                    e.stopPropagation();
                    props.onToggle();
                }}
                title={props.isDisabled ? `Enable ${toolName}` : `Disable ${toolName}`}
            >
                <Show when={props.isDisabled}>
                    <Plus size={12} />
                </Show>
                <Show when={!props.isDisabled}>
                    <X size={12} />
                </Show>
            </button>
        </div>
    );
}
