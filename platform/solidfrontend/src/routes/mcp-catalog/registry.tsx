import { useMcpRegistry } from "@/lib/mcp-registry.query";
import { McpRegistry } from "~/components/mcp-registry/McpRegistry";

export default function RegistryPage() {
    const { data: catalog, query } = useMcpRegistry();

    return <McpRegistry catalog={catalog()} error={Boolean(query.error)} pending={query.pending} />;
}
