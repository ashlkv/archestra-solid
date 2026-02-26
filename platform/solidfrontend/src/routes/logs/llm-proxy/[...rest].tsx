import type { JSX } from "solid-js";
import { LlmProxyLogsPage } from "@/components/logs/LlmProxyLogsPage";

/**
 * Catch-all route for /logs/llm-proxy sub-paths
 * (e.g. /logs/llm-proxy/session/:id, /logs/llm-proxy/entry/:id).
 *
 * Supports direct URL access for bookmarks, shared links, and page refresh.
 * The component reads session/entry IDs from window.location on mount and
 * manages subsequent state via signals + history.replaceState.
 */
export default function LlmProxyCatchAllRoute(): JSX.Element {
    return <LlmProxyLogsPage />;
}
