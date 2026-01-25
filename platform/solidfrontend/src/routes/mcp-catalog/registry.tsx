import { McpRegistry } from "@/components/mcp-registry/McpRegistry";
import { useMcpRegistry } from '@/lib/mcp-registry.query';

export default function RegistryPage() {
    const { data: catalog, query } = useMcpRegistry();

    return (
        <McpRegistry catalog={catalog()} error={Boolean(query.error)} pending={query.pending} />
    );
}
