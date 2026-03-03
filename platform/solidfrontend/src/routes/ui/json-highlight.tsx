import type { JSX } from "solid-js";
import { JsonHighlight } from "@/components/common/JsonHighlight";
import { UiLayout } from "@/components/ui-demo/UiLayout";

const SIMPLE_JSON = JSON.stringify(
    {
        name: "Archestra",
        version: "2.1.0",
        features: ["MCP Gateway", "Dual LLM", "TOON compression"],
        config: { port: 9000, debug: false },
    },
    null,
    2,
);

const NESTED_JSON = JSON.stringify(
    {
        user: { id: "usr_42", email: "alice@example.com" },
        permissions: ["read", "write"],
        metadata: { createdAt: "2025-06-01T10:00:00Z", active: true },
    },
    null,
    2,
);

export default function JsonHighlightDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "800px", margin: "0 auto" }} data-label="JsonHighlightDemo">
                <h1>JsonHighlight</h1>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Read-only CodeMirror JSON viewer with syntax highlighting, folding, and optional line numbers.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="With line numbers">
                        <h3 style={{ "margin-bottom": "0.5rem" }}>With line numbers</h3>
                        <JsonHighlight code={SIMPLE_JSON} lineNumbers />
                    </section>

                    <section data-label="Without line numbers">
                        <h3 style={{ "margin-bottom": "0.5rem" }}>Without line numbers</h3>
                        <JsonHighlight code={NESTED_JSON} />
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
