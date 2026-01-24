import { archestraApiSdk } from "@shared";
import { serversideFetch } from "@/lib/api";
import { useInternalMcpCatalog } from "@/lib/internal-mcp-catalog.query";
import { Catalog } from "~/components/Catalog";

export default function CatalogPage() {
    const catalog = serversideFetch((headers) => archestraApiSdk.getInternalMcpCatalog({ headers }));
    const catalogQuery = useInternalMcpCatalog({ initialData: catalog() });

    return (
        <Catalog catalog={catalogQuery.data ?? []} />
    );
}
