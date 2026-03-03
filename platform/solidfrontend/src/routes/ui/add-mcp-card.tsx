import type { JSX } from "solid-js";
import { AddMcpCard } from "@/components/mcp-registry/AddMcpCard";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function AddMcpCardDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "800px", margin: "0 auto" }} data-label="AddMcpCardDemo">
                <h2>Add MCP card</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    A call-to-action card for adding a new MCP server to the registry.
                </p>
                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Default">
                        <h3>Default</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.75rem" }}>
                            Click the card to trigger the action.
                        </p>
                        <div style={{ "max-width": "400px" }}>
                            <AddMcpCard onClick={() => console.log("Add MCP server clicked")} />
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
