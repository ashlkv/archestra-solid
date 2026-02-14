import { PageHeader } from "~/components/primitives/PageHeader";
import { ToolTable } from "~/components/tools/ToolTable";
import { useResultPolicies, useToolCallPolicies } from "~/lib/policy.query";
import { useTools } from "~/lib/tool.query";

export default function ToolsPage() {
    const { data: tools, query: toolsQuery } = useTools({ limit: 100 });
    const { data: callPolicies } = useToolCallPolicies();
    const { data: resultPolicies } = useResultPolicies();

    return (
        <>
            <PageHeader
                title="Tools"
                description="Tools displayed here are either detected from requests between agents and LLMs or sourced from installed MCP servers."
            />
            <ToolTable
                tools={tools}
                callPolicies={callPolicies}
                resultPolicies={resultPolicies}
                error={toolsQuery.error}
                pending={toolsQuery.pending}
            />
        </>
    );
}
