import type { JSX } from "solid-js";
import { OriginBadge } from "@/components/llm/OriginBadge";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function OriginBadgeDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="OriginBadgeDemo">
                <h2>OriginBadge</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Displays a badge showing the origin of a tool, with smart defaults for archestra tools, MCP servers,
                    and external agents.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Archestra tool">
                        <h3>Archestra tool</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.5rem" }}>
                            Tools prefixed with <code>archestra__</code> show the archestra icon and primary variant.
                        </p>
                        <OriginBadge toolName="archestra__whoami" />
                    </section>

                    <section data-label="MCP server tool">
                        <h3>MCP server tool (explicit name)</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.5rem" }}>
                            When <code>mcpServerName</code> is provided, it takes precedence.
                        </p>
                        <OriginBadge toolName="read_file" mcpServerName="filesystem" />
                    </section>

                    <section data-label="Double-underscore prefix">
                        <h3>Server prefix via double-underscore</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.5rem" }}>
                            Tool names with <code>__</code> extract the server prefix automatically.
                        </p>
                        <OriginBadge toolName="github__search_repos" />
                    </section>

                    <section data-label="Plain tool">
                        <h3>Plain tool (no prefix, no MCP server)</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.5rem" }}>
                            Falls back to Claude Code as the default external agent.
                        </p>
                        <OriginBadge toolName="bash" />
                    </section>

                    <section data-label="All together">
                        <h3>Side by side</h3>
                        <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem", "margin-top": "0.5rem" }}>
                            <OriginBadge toolName="archestra__whoami" />
                            <OriginBadge toolName="read_file" mcpServerName="filesystem" />
                            <OriginBadge toolName="github__search_repos" />
                            <OriginBadge toolName="bash" />
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
