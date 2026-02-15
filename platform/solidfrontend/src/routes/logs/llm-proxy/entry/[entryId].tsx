import { useParams } from "@solidjs/router";
import type { JSX } from "solid-js";
import { LlmProxyLogsPage } from "../index";

export default function EntryDetailPage(): JSX.Element {
    const params = useParams<{ entryId: string }>();
    return <LlmProxyLogsPage initialLogId={params.entryId} />;
}
