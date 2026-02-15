import { type Accessor, createSignal, For, Show } from "solid-js";
import type { CallPolicy, ResultPolicy, ToolWithAssignments } from "@/types";
import { Alert } from "../primitives/Alert";
import { Badge } from "../primitives/Badge";
import { Checkbox } from "../primitives/Checkbox";
import { Empty, EmptyDescription } from "../primitives/Empty";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "../primitives/Table";
import { Assignments } from "./Assignments";
import { CallPolicyToggle } from "./CallPolicyToggle";
import { ResultPolicySelect } from "./ResultPolicySelect";
import { ToolHoverCard } from "./ToolHoverCard";
import styles from "./ToolTable.module.css";

type Agent = { id: string; name: string };
type CallPolicyAction = CallPolicy["action"];
type ResultPolicyAction = ResultPolicy["action"];

type Column = "select" | "name" | "origin" | "assignments" | "call-policy" | "result-policy";

export function ToolTable(props: {
    tools: Accessor<ToolWithAssignments[]>;
    agents: Accessor<Agent[]>;
    callPolicies: Accessor<CallPolicy[]>;
    resultPolicies: Accessor<ResultPolicy[]>;
    error: Error | undefined;
    pending: boolean;
    columns?: Column[];
    onSelectionChange?: (selectedIds: Set<string>) => void;
}) {
    const [selectedIds, setSelectedIds] = createSignal<Set<string>>(new Set());

    const showColumn = (column: Column) => {
        if (props.columns?.length) return props.columns.includes(column);
        // When no columns specified, show all except opt-in columns
        return column !== "select";
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

    return (
        <>
            <Show when={props.error}>
                <Alert variant="destructive">Failed to load tools</Alert>
            </Show>

            <Show when={props.pending}>
                <p>Loading...</p>
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
}) {
    const isAutoDiscovered = () =>
        !props.tool.catalogId && !props.tool.mcpServerName && !props.tool.name.startsWith("archestra__");
    const origin = () =>
        props.tool.name.startsWith("archestra__") ? "archestra" : (props.tool.mcpServerName ?? "LLM Proxy");
    const methodName = () => {
        if (props.tool.catalogId) return props.tool.name.replace(props.tool.catalogId + "__", "");
        if (props.tool.name.startsWith("archestra__")) return props.tool.name.replace("archestra__", "");
        return props.tool.name;
    };
    const showColumn = (column: Column) => {
        if (props.columns?.length) return props.columns.includes(column);
        return column !== "select";
    };
    const isBlocked = () => props.callPolicy?.action === "block_always";

    const rowClass = () => {
        const classes: string[] = [];
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
                    <ToolHoverCard
                        name={props.tool.name}
                        description={props.tool.description}
                        parameters={props.tool.parameters}
                    >
                        <span class={styles["tool-name"]}>{methodName()}</span>
                    </ToolHoverCard>
                </TableCell>
            </Show>
            <Show when={showColumn("origin")}>
                <TableCell>
                    <Badge variant={origin() === "archestra" ? "primary" : "muted"}>{origin()}</Badge>
                </TableCell>
            </Show>
            <Show when={showColumn("assignments")}>
                <TableCell>
                    <Assignments
                        toolId={props.tool.id}
                        assignments={props.tool.assignments}
                        agents={props.agents}
                        readOnly={isAutoDiscovered()}
                    />
                </TableCell>
            </Show>
            <Show when={showColumn("call-policy")}>
                <TableCell>
                    <CallPolicyToggle
                        toolId={props.tool.id}
                        policyId={props.callPolicy?.id}
                        value={props.callPolicy?.action}
                    />
                </TableCell>
            </Show>
            <Show when={showColumn("result-policy")}>
                <TableCell>
                    <ResultPolicySelect
                        toolId={props.tool.id}
                        policyId={props.resultPolicy?.id}
                        value={props.resultPolicy?.action}
                    />
                </TableCell>
            </Show>
        </TableRow>
    );
}
