import { Catalog } from "~/components/Catalog";
import { useMcpRegistry } from '@/lib/mcp-registry.query';


export default function CatalogPage() {
    const { data: catalog, query } = useMcpRegistry();

    return (
        <Catalog catalog={catalog()} error={Boolean(query.error)} pending={query.pending} />
    );
}
