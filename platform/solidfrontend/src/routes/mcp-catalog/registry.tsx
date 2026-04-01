import { useMcpRegistry } from "@/mcp-registry/mcp-registry.query";
import { McpRegistry } from "~/mcp-registry/components/McpRegistry";

export default function RegistryPage() {
    const { data: catalog, query } = useMcpRegistry();

    return <McpRegistry catalog={catalog()} error={Boolean(query.error)} pending={query.pending} />;
}
