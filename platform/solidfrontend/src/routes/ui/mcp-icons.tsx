import { For, type JSX } from "solid-js";
import { IconArchestra } from "@/components/mcp-icons/IconArchestra";
import { IconClaudeCode } from "@/components/mcp-icons/IconClaudeCode";
import { IconContext7 } from "@/components/mcp-icons/IconContext7";
import { IconGitHub } from "@/components/mcp-icons/IconGitHub";
import { IconJira } from "@/components/mcp-icons/IconJira";
import { IconKubernetes } from "@/components/mcp-icons/IconKubernetes";
import { IconPlaywright } from "@/components/mcp-icons/IconPlaywright";
import { UiLayout } from "@/components/ui-demo/UiLayout";

const ICONS: Array<{ name: string; component: (props: { size?: number; class?: string }) => JSX.Element }> = [
    { name: "Archestra", component: IconArchestra },
    { name: "Claude Code", component: IconClaudeCode },
    { name: "Context7", component: IconContext7 },
    { name: "GitHub", component: IconGitHub },
    { name: "Jira", component: IconJira },
    { name: "Kubernetes", component: IconKubernetes },
    { name: "Playwright", component: IconPlaywright },
];

export default function McpIconsDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="McpIconsDemo">
                <h2>MCP icons</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Branded icons for known MCP servers. Each icon accepts a <code>size</code> prop.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Size 24">
                        <h3>Size 24</h3>
                        <div
                            style={{
                                display: "grid",
                                "grid-template-columns": "repeat(auto-fill, minmax(120px, 1fr))",
                                gap: "1rem",
                                "margin-top": "0.5rem",
                            }}
                        >
                            <For each={ICONS}>
                                {(icon) => (
                                    <div
                                        style={{
                                            display: "flex",
                                            "flex-direction": "column",
                                            "align-items": "center",
                                            gap: "0.5rem",
                                            padding: "1rem",
                                            border: "1px solid var(--border)",
                                            "border-radius": "var(--radius)",
                                        }}
                                        data-label={`Icon: ${icon.name}`}
                                    >
                                        <icon.component size={24} />
                                        <span
                                            style={{
                                                color: "var(--muted-foreground)",
                                                "font-size": "var(--small-font-size)",
                                            }}
                                        >
                                            {icon.name}
                                        </span>
                                    </div>
                                )}
                            </For>
                        </div>
                    </section>

                    <section data-label="Size 48">
                        <h3>Size 48</h3>
                        <div
                            style={{
                                display: "grid",
                                "grid-template-columns": "repeat(auto-fill, minmax(120px, 1fr))",
                                gap: "1rem",
                                "margin-top": "0.5rem",
                            }}
                        >
                            <For each={ICONS}>
                                {(icon) => (
                                    <div
                                        style={{
                                            display: "flex",
                                            "flex-direction": "column",
                                            "align-items": "center",
                                            gap: "0.5rem",
                                            padding: "1rem",
                                            border: "1px solid var(--border)",
                                            "border-radius": "var(--radius)",
                                        }}
                                        data-label={`Icon: ${icon.name}`}
                                    >
                                        <icon.component size={48} />
                                        <span
                                            style={{
                                                color: "var(--muted-foreground)",
                                                "font-size": "var(--small-font-size)",
                                            }}
                                        >
                                            {icon.name}
                                        </span>
                                    </div>
                                )}
                            </For>
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
