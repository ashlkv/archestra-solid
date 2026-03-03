import type { JSX } from "solid-js";
import { TruncatedText } from "@/components/common/TruncatedText";
import { UiLayout } from "@/components/ui-demo/UiLayout";

const SHORT_TEXT = "Quick status check";
const LONG_TEXT =
    "The MCP server encountered a timeout while attempting to connect to the upstream provider API, resulting in a 504 Gateway Timeout response after 30 seconds of waiting.";

export default function TruncatedTextDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "800px", margin: "0 auto" }} data-label="TruncatedTextDemo">
                <h1>TruncatedText</h1>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Truncates long text with ellipsis and shows the full text in a tooltip on hover.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "1.5rem" }}>
                    <section data-label="Short text">
                        <h3 style={{ "margin-bottom": "0.5rem" }}>Short text (no truncation)</h3>
                        <TruncatedText message={SHORT_TEXT} />
                    </section>

                    <section data-label="Default truncation">
                        <h3 style={{ "margin-bottom": "0.5rem" }}>Long text (default maxLength: 50)</h3>
                        <TruncatedText message={LONG_TEXT} />
                    </section>

                    <section data-label="Custom maxLength">
                        <h3 style={{ "margin-bottom": "0.5rem" }}>Custom maxLength: 80</h3>
                        <TruncatedText message={LONG_TEXT} maxLength={80} />
                    </section>

                    <section data-label="Tooltip disabled">
                        <h3 style={{ "margin-bottom": "0.5rem" }}>Tooltip disabled</h3>
                        <TruncatedText message={LONG_TEXT} showTooltip={false} />
                    </section>

                    <section data-label="Undefined message">
                        <h3 style={{ "margin-bottom": "0.5rem" }}>Undefined message</h3>
                        <TruncatedText message={undefined} />
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
