import { clientOnly } from "@solidjs/start";
import { FixedLayout } from "~/components/primitives/FixedLayout";
import { useMcpRegistry } from "@/lib/mcp-registry.query";

const McpRegistry = clientOnly(() => import("@/components/mcp-registry/McpRegistry").then(m => ({ default: m.McpRegistry })));

export default function RegistryPage() {
    const { data: catalog, query } = useMcpRegistry();

    return (
        <FixedLayout>
            <McpRegistry catalog={catalog()} error={Boolean(query.error)} pending={query.pending} />
        </FixedLayout>
    );
}
