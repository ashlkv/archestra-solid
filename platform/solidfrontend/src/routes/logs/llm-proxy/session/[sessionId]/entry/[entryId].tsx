import { useParams } from "@solidjs/router";
import type { JSX } from "solid-js";
import { LlmProxyLogsPage } from "../../../index";

export default function SessionEntryDetailPage(): JSX.Element {
    const params = useParams<{ sessionId: string; entryId: string }>();
    return <LlmProxyLogsPage initialExpandedSessionId={params.sessionId} initialLogId={params.entryId} />;
}
