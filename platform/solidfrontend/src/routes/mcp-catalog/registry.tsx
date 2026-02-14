import { clientOnly } from "@solidjs/start";
import { MainLayout } from "~/components/primitives/MainLayout";
import { useMcpRegistry } from "@/lib/mcp-registry.query";

const McpRegistry = clientOnly(() => import("@/components/mcp-registry/McpRegistry").then(m => ({ default: m.McpRegistry })));

export default function RegistryPage() {
    const { data: catalog, query } = useMcpRegistry();

    return (
        <MainLayout>
            <McpRegistry catalog={catalog()} error={Boolean(query.error)} pending={query.pending} />
        </MainLayout>
    );
}
