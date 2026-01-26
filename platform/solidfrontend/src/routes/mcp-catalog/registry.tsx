import { McpRegistry } from "@/components/mcp-registry/McpRegistry";
import { MainLayout } from "~/components/primitives/MainLayout";
import { PageHeader } from "~/components/primitives/PageHeader";
import { useMcpRegistry } from "@/lib/mcp-registry.query";

export default function RegistryPage() {
    const { data: catalog, query } = useMcpRegistry();

    return (
        <MainLayout variant="muted">
            {/*<PageHeader title="MCP Catalog" />*/}
            <McpRegistry catalog={catalog()} error={Boolean(query.error)} pending={query.pending} />
        </MainLayout>
    );
}
