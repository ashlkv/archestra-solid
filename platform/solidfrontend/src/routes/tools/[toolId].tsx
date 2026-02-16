import { useParams } from "@solidjs/router";
import ToolsPage from "./index";

export default function ToolDetailPage() {
    const params = useParams<{ toolId: string }>();
    return <ToolsPage initialToolId={params.toolId} />;
}
