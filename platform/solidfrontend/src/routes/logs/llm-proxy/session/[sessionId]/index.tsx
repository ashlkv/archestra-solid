import { useParams } from "@solidjs/router";
import type { JSX } from "solid-js";
import { LlmProxyLogsPage } from "../../index";

export default function SessionDetailPage(): JSX.Element {
    const params = useParams<{ sessionId: string }>();
    return <LlmProxyLogsPage initialExpandedSessionId={params.sessionId} />;
}
