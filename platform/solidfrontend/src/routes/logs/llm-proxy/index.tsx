import type { JSX } from "solid-js";
import { LlmProxyLogsPage } from "@/components/logs/LlmProxyLogsPage";

/**
 * Index route for /logs/llm-proxy.
 *
 * This file is required because without it, /logs/llm-proxy would be matched
 * by /logs/[id].tsx (with id="llm-proxy") instead of the [...rest] catch-all.
 * SolidStart prioritizes dynamic params over catch-alls with empty segments.
 */
export default function LlmProxyLogsIndexRoute(): JSX.Element {
    return <LlmProxyLogsPage />;
}
