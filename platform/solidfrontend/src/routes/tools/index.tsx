import { useNavigate } from "@solidjs/router";
import { createMemo, createSignal } from "solid-js";
import { PageHeader } from "~/components/primitives/PageHeader";
import { AgentAssignmentTabs } from "~/components/tools/AgentAssignmentTabs";
import { ToolDrawer } from "~/components/tools/ToolDrawer";
import { ToolTable } from "~/components/tools/ToolTable";
import { useAgents, useAssignTool } from "~/lib/agent.query";
import { useResultPolicies, useToolCallPolicies } from "~/lib/policy.query";
import { useTools, useUnassignTool } from "~/lib/tool.query";

export default function ToolsPage(props: { initialToolId?: string }) {
    const navigate = useNavigate();
    const { data: tools, query: toolsQuery } = useTools({ limit: 100 });
    const { data: callPolicies } = useToolCallPolicies();
    const { data: resultPolicies } = useResultPolicies();
    const { data: agents } = useAgents();

    const [selectedAgentId, setSelectedAgentId] = createSignal<string | undefined>(undefined);

    const assignTool = useAssignTool();
    const unassignTool = useUnassignTool();

    const columns = createMemo(() =>
        selectedAgentId() ? (["select", "name", "assignments"] as ("select" | "name" | "assignments")[]) : undefined,
    );

    const initialSelectedIds = createMemo(() => {
        const agentId = selectedAgentId();
        if (!agentId) return undefined;
        return new Set(
            (tools() ?? [])
                .filter((tool) => tool.assignments.some((a) => a.agent.id === agentId))
                .map((tool) => tool.id),
        );
    });

    function handleSelectionChange(nextIds: Set<string>) {
        const agentId = selectedAgentId();
        if (!agentId) return;

        const currentIds = initialSelectedIds() ?? new Set<string>();

        // Newly checked → assign
        for (const toolId of nextIds) {
            if (!currentIds.has(toolId)) {
                assignTool.submit({ agentId, toolId });
            }
        }

        // Newly unchecked → unassign
        for (const toolId of currentIds) {
            if (!nextIds.has(toolId)) {
                unassignTool.submit({ agentId, toolId });
            }
        }
    }

    const drawerToolId = () => props.initialToolId ?? null;
    const drawerOpen = () => drawerToolId() !== null;

    const openDrawer = (toolId: string) => {
        navigate(`/tools/${toolId}`, { replace: true });
    };

    const closeDrawer = () => {
        navigate("/tools", { replace: true });
    };

    return (
        <>
            <PageHeader
                title="Tools"
                description="Tools displayed here are either detected from requests between agents and LLMs or sourced from installed MCP servers."
            />
            <AgentAssignmentTabs
                agents={agents}
                tools={tools}
                selectedAgentId={selectedAgentId()}
                onSelect={setSelectedAgentId}
            />
            <ToolTable
                tools={tools}
                agents={agents}
                callPolicies={callPolicies}
                resultPolicies={resultPolicies}
                error={toolsQuery.error}
                pending={toolsQuery.pending}
                columns={columns()}
                initialSelectedIds={initialSelectedIds}
                onSelectionChange={handleSelectionChange}
                selectedAgentId={selectedAgentId()}
                onToolClick={openDrawer}
            />
            <ToolDrawer
                toolId={drawerToolId()}
                open={drawerOpen()}
                onOpenChange={(open) => {
                    if (!open) closeDrawer();
                }}
            />
        </>
    );
}
