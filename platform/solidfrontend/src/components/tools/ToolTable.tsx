import { For, Show, type Accessor } from "solid-js";
import type { CallPolicy, ResultPolicy, ToolWithAssignments } from "@/types";
import { Alert } from "../primitives/Alert";
import { Badge } from "../primitives/Badge";
import { Empty, EmptyDescription } from "../primitives/Empty";
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableHeaderCell,
    TableCell,
} from "../primitives/Table";
import { Assignments } from "./Assignments";
import { CallPolicyToggle } from "./CallPolicyToggle";
import { ResultPolicySelect } from "./ResultPolicySelect";
import { ToolHoverCard } from "./ToolHoverCard";
import styles from "./ToolTable.module.css";

type Agent = { id: string; name: string };
type CallPolicyAction = CallPolicy["action"]
type ResultPolicyAction = ResultPolicy["action"]

type Column = "name" | "origin" | "assignments" | "call-policy" | "result-policy";

export function ToolTable(props: {
    tools: Accessor<ToolWithAssignments[]>;
    agents: Accessor<Agent[]>
    callPolicies: Accessor<CallPolicy[]>;
    resultPolicies: Accessor<ResultPolicy[]>;
    error: Error | undefined;
    pending: boolean;
    columns?: Column[];
}) {
    const showColumn = (column: Column) => !props.columns?.length || props.columns.includes(column);

    const callPolicyDictionary = () => {
        const dictionary: Record<string, { id: string; action: CallPolicyAction }> = {};
        for (const policy of props.callPolicies()) {
            if (policy.conditions.length === 0) {
                dictionary[policy.toolId] = { id: policy.id, action: policy.action };
            }
        }
        return dictionary;
    };

    const resultPolicyDictionary = () => {
        const dictionary: Record<string, { id: string; action: ResultPolicyAction }> = {};
        for (const policy of props.resultPolicies()) {
            if (policy.conditions.length === 0) {
                dictionary[policy.toolId] = { id: policy.id, action: policy.action };
            }
        }
        return dictionary;
    };

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
                            <Show when={showColumn("name")}><TableHeaderCell>Tool name</TableHeaderCell></Show>
                            <Show when={showColumn("origin")}><TableHeaderCell>Origin</TableHeaderCell></Show>
                            <Show when={showColumn("assignments")}><TableHeaderCell>Assignments</TableHeaderCell></Show>
                            <Show when={showColumn("call-policy")}><TableHeaderCell>Call policy</TableHeaderCell></Show>
                            <Show when={showColumn("result-policy")}><TableHeaderCell>Results are</TableHeaderCell></Show>
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
}) {
    const origin = () => props.tool.name.startsWith("archestra__") ? "archestra" : props.tool.mcpServerName ?? "LLM Proxy";
    const methodName = () => props.tool.name.replace(origin() + "__", "");
    const showColumn = (column: Column) => !props.columns?.length || props.columns.includes(column);
    const isBlocked = () => props.callPolicy?.action === "block_always";

    return (
        <TableRow class={isBlocked() ? styles.blocked : ""}>
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
                    <Badge variant={origin() === "archestra" ? "primary" : "muted"}>
                        {origin()}
                    </Badge>
                </TableCell>
            </Show>
            <Show when={showColumn("assignments")}>
                <TableCell>
                    <Assignments toolId={props.tool.id} assignments={props.tool.assignments} agents={props.agents} />
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
