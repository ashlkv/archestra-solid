import { For, Show, type Accessor } from "solid-js";
import type { CallPolicy, ResultPolicy, ToolWithAssignments } from "@/types";
import { useAgents } from "@/lib/agent.query";
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

type Agent = { id: string; name: string };
type CallPolicyAction = CallPolicy["action"]
type ResultPolicyAction = ResultPolicy["action"]

export function ToolTable(props: {
    tools: Accessor<ToolWithAssignments[] | undefined>;
    callPolicies: Accessor<CallPolicy[] | undefined>;
    resultPolicies: Accessor<ResultPolicy[] | undefined>;
    error: Error | undefined;
    pending: boolean;
}) {
    const { data: agents } = useAgents();

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
                            <TableHeaderCell>Tool name</TableHeaderCell>
                            <TableHeaderCell>Origin</TableHeaderCell>
                            <TableHeaderCell>Assignments</TableHeaderCell>
                            <TableHeaderCell>Call policy</TableHeaderCell>
                            <TableHeaderCell>Results are</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <For each={props.tools()}>
                            {(tool) => (
                                <ToolRow
                                    tool={tool}
                                    agents={agents}
                                    callPolicy={callPolicyDictionary()[tool.id]}
                                    resultPolicy={resultPolicyDictionary()[tool.id]}
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
}) {
    const origin = () => props.tool.name.startsWith("archestra__") ? "archestra" : props.tool.mcpServerName ?? "LLM Proxy";
    const methodName = () => props.tool.name.replace(origin() + "__", "");

    return (
        <TableRow>
            <TableCell>
                <span>{methodName}</span>
            </TableCell>
            <TableCell>
                <Badge variant={origin() === "archestra" ? "primary" : "muted"}>
                    {origin()}
                </Badge>
            </TableCell>
            <TableCell>
                <Assignments toolId={props.tool.id} assignments={props.tool.assignments} agents={props.agents} />
            </TableCell>
            <TableCell>
                <CallPolicyToggle
                    toolId={props.tool.id}
                    policyId={props.callPolicy?.id}
                    value={props.callPolicy?.action}
                />
            </TableCell>
            <TableCell>
                <ResultPolicySelect
                    toolId={props.tool.id}
                    policyId={props.resultPolicy?.id}
                    value={props.resultPolicy?.action}
                />
            </TableCell>
        </TableRow>
    );
}
