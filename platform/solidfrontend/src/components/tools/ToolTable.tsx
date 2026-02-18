import { type Accessor, createEffect, createSignal, For, on, Show } from "solid-js";
import type { CallPolicy, ResultPolicy, ToolWithAssignments } from "@/types";
import { Alert } from "../primitives/Alert";
import { Button } from "../primitives/Button";
import { Checkbox } from "../primitives/Checkbox";
import { Empty, EmptyDescription } from "../primitives/Empty";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "../primitives/Table";
import { Assignments } from "./Assignments";
import { CallPolicyToggle } from "./policy/CallPolicyToggle";
import { GroupPolicyBar } from "./policy/GroupPolicyBar";
import { OriginBadge } from "./OriginBadge";
import { ResultPolicySelect } from "./policy/ResultPolicySelect";
import { ToolName } from "./ToolName";
import styles from "./ToolTable.module.css";

type Agent = { id: string; name: string };
type CallPolicyAction = CallPolicy["action"];
type ResultPolicyAction = ResultPolicy["action"];

type Column = "select" | "name" | "origin" | "assignments" | "call-policy" | "result-policy" | "edit";

export function ToolTable(props: {
    tools: Accessor<ToolWithAssignments[]>;
    agents: Accessor<Agent[]>;
    callPolicies: Accessor<CallPolicy[]>;
    resultPolicies: Accessor<ResultPolicy[]>;
    error: Error | undefined;
    pending: boolean;
    columns?: Column[];
    initialSelectedIds?: Accessor<Set<string> | undefined>;
    onSelectionChange?: (selectedIds: Set<string>) => void;
    selectedAgentId?: string;
    onToolClick?: (toolId: string) => void;
}) {
    const [selectedIds, setSelectedIds] = createSignal<Set<string>>(new Set(), { name: "selectedIds" });

    // Sync selection from parent when in agent mode (initialSelectedIds returns a Set).
    // In master mode, initialSelectedIds returns undefined — a stable primitive that won't
    // re-trigger, so the user's manual checkbox selections are preserved across data reloads.
    // When switching back from agent to master, it transitions from Set → undefined,
    // which triggers the effect and clears the agent's selection.
    createEffect(
        on(
            () => props.initialSelectedIds?.(),
            (ids) => {
                setSelectedIds(ids ?? new Set<string>());
            },
        ),
    );

    const showColumn = (column: Column) => {
        if (props.columns?.length) return props.columns.includes(column);
        return true;
    };

    const callPolicyDictionary = () => {
        const dictionary: Record<string, { id: string; action: CallPolicyAction }> = {};
        for (const policy of props.callPolicies() ?? []) {
            if (policy.conditions.length === 0) {
                dictionary[policy.toolId] = { id: policy.id, action: policy.action };
            }
        }
        return dictionary;
    };

    const resultPolicyDictionary = () => {
        const dictionary: Record<string, { id: string; action: ResultPolicyAction }> = {};
        for (const policy of props.resultPolicies() ?? []) {
            if (policy.conditions.length === 0) {
                dictionary[policy.toolId] = { id: policy.id, action: policy.action };
            }
        }
        return dictionary;
    };

    const toolCount = () => props.tools()?.length ?? 0;
    const selectedCount = () => selectedIds().size;
    const allSelected = () => toolCount() > 0 && selectedCount() === toolCount();
    const someSelected = () => selectedCount() > 0 && selectedCount() < toolCount();

    function updateSelection(next: Set<string>) {
        setSelectedIds(next);
        props.onSelectionChange?.(next);
    }

    function toggleAll(checked: boolean) {
        if (checked) {
            const all = new Set(props.tools()?.map((t) => t.id) ?? []);
            updateSelection(all);
        } else {
            updateSelection(new Set());
        }
    }

    function toggleOne(toolId: string, checked: boolean) {
        const next = new Set(selectedIds());
        if (checked) {
            next.add(toolId);
        } else {
            next.delete(toolId);
        }
        updateSelection(next);
    }

    const groupBarDisabled = () => selectedCount() === 0;
    const showGroupBar = () => !props.selectedAgentId && showColumn("select");

    function clearSelection() {
        updateSelection(new Set());
    }

    return (
        <>
            <Show when={props.error}>
                <Alert variant="destructive">Failed to load tools</Alert>
            </Show>

            <Show when={props.pending}>
                <p>Loading...</p>
            </Show>

            <Show when={showGroupBar()}>
                <GroupPolicyBar
                    selectedIds={selectedIds}
                    callPolicyDictionary={callPolicyDictionary}
                    resultPolicyDictionary={resultPolicyDictionary}
                    onClear={clearSelection}
                    disabled={groupBarDisabled()}
                />
            </Show>

            <Show when={props.tools()?.length}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <Show when={showColumn("select")}>
                                <TableHeaderCell class={styles["checkbox-cell"]}>
                                    <Checkbox
                                        checked={allSelected()}
                                        indeterminate={someSelected()}
                                        onChange={toggleAll}
                                    />
                                </TableHeaderCell>
                            </Show>
                            <Show when={showColumn("name")}>
                                <TableHeaderCell>Tool name</TableHeaderCell>
                            </Show>
                            <Show when={showColumn("origin")}>
                                <TableHeaderCell>Origin</TableHeaderCell>
                            </Show>
                            <Show when={showColumn("assignments")}>
                                <TableHeaderCell>Assignments</TableHeaderCell>
                            </Show>
                            <Show when={showColumn("call-policy")}>
                                <TableHeaderCell>Call policy</TableHeaderCell>
                            </Show>
                            <Show when={showColumn("result-policy")}>
                                <TableHeaderCell>Results are</TableHeaderCell>
                            </Show>
                            <Show when={showColumn("edit")}>
                                <TableHeaderCell class={styles["edit-cell"]} />
                            </Show>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <For each={props.tools()}>
                            {(tool) => (
                                <ToolRow
                                    tool={tool}
                                    agents={props.agents}
                                    callPolicy={callPolicyDictionary()[tool.id]}
                                    resultPolicy={resultPolicyDictionary()[tool.id]}
                                    columns={props.columns}
                                    selected={selectedIds().has(tool.id)}
                                    onToggle={(checked) => toggleOne(tool.id, checked)}
                                    selectedAgentId={props.selectedAgentId}
                                    onToolClick={props.onToolClick}
                                />
                            )}
                        </For>
                    </TableBody>
                </Table>
            </Show>

            <Show when={props.tools() && !props.tools()?.length}>
                <Empty>
                    <EmptyDescription>No tools found</EmptyDescription>
                </Empty>
            </Show>
        </>
    );
}

function ToolRow(props: {
    tool: ToolWithAssignments;
    agents: Accessor<Agent[] | undefined>;
    callPolicy: { id: string; action: CallPolicyAction } | undefined;
    resultPolicy: { id: string; action: ResultPolicyAction } | undefined;
    columns?: Column[];
    selected: boolean;
    onToggle: (checked: boolean) => void;
    selectedAgentId?: string;
    onToolClick?: (toolId: string) => void;
}) {
    const isAutoDiscovered = () =>
        !props.tool.catalogId && !props.tool.mcpServerName && !props.tool.name.startsWith("archestra__");
    const showColumn = (column: Column) => {
        if (props.columns?.length) return props.columns.includes(column);
        return true;
    };
    const isBlocked = () => props.callPolicy?.action === "block_always";

    const rowClass = () => {
        const classes: string[] = [styles.row];
        if (isBlocked()) classes.push(styles.blocked);
        if (props.selected) classes.push(styles.selected);
        return classes.join(" ");
    };

    return (
        <TableRow class={rowClass()}>
            <Show when={showColumn("select")}>
                <TableCell class={styles["checkbox-cell"]}>
                    <Checkbox checked={props.selected} onChange={props.onToggle} />
                </TableCell>
            </Show>
            <Show when={showColumn("name")}>
                <TableCell>
                    <ToolName
                        name={props.tool.name}
                        tool={{ description: props.tool.description, parameters: props.tool.parameters }}
                    />
                </TableCell>
            </Show>
            <Show when={showColumn("origin")}>
                <TableCell>
                    <OriginBadge toolName={props.tool.name} mcpServerName={props.tool.mcpServerName} />
                </TableCell>
            </Show>
            <Show when={showColumn("assignments")}>
                <TableCell>
                    <Assignments
                        toolId={props.tool.id}
                        assignments={props.tool.assignments}
                        agents={props.agents}
                        readOnly={isAutoDiscovered()}
                        compact={!props.selectedAgentId}
                        priorityAgentId={props.selectedAgentId}
                    />
                </TableCell>
            </Show>
            <Show when={showColumn("call-policy")}>
                <TableCell>
                    <CallPolicyToggle
                        toolId={props.tool.id}
                        policyId={props.callPolicy?.id}
                        value={props.callPolicy?.action}
                        size="xsmall"
                    />
                </TableCell>
            </Show>
            <Show when={showColumn("result-policy")}>
                <TableCell>
                    <ResultPolicySelect
                        toolId={props.tool.id}
                        policyId={props.resultPolicy?.id}
                        value={props.resultPolicy?.action}
                        size="xsmall"
                    />
                </TableCell>
            </Show>
            <Show when={showColumn("edit")}>
                <TableCell class={styles["edit-cell"]}>
                    <Button
                        size="small"
                        class={styles["edit-button"]}
                        onClick={() => props.onToolClick?.(props.tool.id)}
                    >
                        Edit policy
                    </Button>
                </TableCell>
            </Show>
        </TableRow>
    );
}
