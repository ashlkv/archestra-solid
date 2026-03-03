import type { JSX } from "solid-js";
import { JsonDiffViewer } from "@/components/common/JsonDiffViewer";
import { UiLayout } from "@/components/ui-demo/UiLayout";

const ORIGINAL_SIMPLE = {
    model: "gpt-4o",
    temperature: 0.7,
    maxTokens: 1024,
    stream: false,
};

const MODIFIED_SIMPLE = {
    model: "gpt-4o-mini",
    temperature: 0.3,
    maxTokens: 1024,
    stream: true,
};

const ORIGINAL_FIELDS = {
    name: "My MCP Server",
    transport: "stdio",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-filesystem"],
    env: { HOME: "/home/user" },
};

const MODIFIED_FIELDS = {
    name: "My MCP Server",
    transport: "streamable-http",
    image: "mcp-server:latest",
    httpPort: 8080,
    httpPath: "/mcp",
    env: { HOME: "/home/user", NODE_ENV: "production" },
};

export default function JsonDiffViewerDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "800px", margin: "0 auto" }} data-label="JsonDiffViewerDemo">
                <h1>JsonDiffViewer</h1>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Side-by-side JSON diff viewer powered by CodeMirror merge view. Highlights changed, added, and
                    removed content.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Property changes">
                        <h3 style={{ "margin-bottom": "0.5rem" }}>Property value changes</h3>
                        <JsonDiffViewer original={ORIGINAL_SIMPLE} modified={MODIFIED_SIMPLE} />
                    </section>

                    <section data-label="Added and removed fields">
                        <h3 style={{ "margin-bottom": "0.5rem" }}>Added and removed fields</h3>
                        <JsonDiffViewer original={ORIGINAL_FIELDS} modified={MODIFIED_FIELDS} />
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
