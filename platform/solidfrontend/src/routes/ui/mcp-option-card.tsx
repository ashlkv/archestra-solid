import { createSignal, type JSX } from "solid-js";
import { Button } from "@/primitives/Button";
import { SearchableSelect } from "@/primitives/SearchableSelect";
import { McpOptionCard } from "@/mcp-registry/components/McpOptionCard";
import { UiLayout } from "@/ui-demo/UiLayout";

const MCP_OPTIONS = [
    {
        value: "my-assistant",
        label: "My Assistant",
        description: "Your personal chat assistant",
        actionLabel: undefined,
    },
    {
        value: "context7",
        label: "context7",
        description: "Docs and API reference search",
        actionLabel: undefined,
    },
    {
        value: "github",
        label: "GitHub",
        description: "Repository access and code context",
        actionLabel: "Edit",
    },
    {
        value: "microsoft__playwright-mcp",
        label: "microsoft__playwright-mcp",
        description: "Browser automation and testing",
        actionLabel: undefined,
    },
] as const;

export default function McpOptionCardDemo(): JSX.Element {
    const [selectedOption, setSelectedOption] = createSignal("my-assistant");

    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="McpOptionCardDemo">
                <h2>MCP option card</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem", "max-width": "42rem" }}>
                    Compact MCP card for searchable pickers and dropdown menus. It keeps the icon, title, description,
                    and room for a selected state or a compact trailing action.
                </p>

                <div style={{ display: "grid", gap: "2rem" }}>
                    <section data-label="Standalone examples">
                        <h3>Standalone</h3>
                        <div
                            style={{
                                display: "grid",
                                gap: "0.75rem",
                                padding: "1rem",
                                "max-width": "32rem",
                                border: "1px solid var(--border)",
                                "border-radius": "var(--large-radius)",
                                background: "var(--card)",
                            }}
                        >
                            <McpOptionCard
                                name="My Assistant"
                                description="Your personal chat assistant"
                                selected
                            />
                            <McpOptionCard
                                name="GitHub"
                                description="Repository access and code context"
                                endContent={
                                    <Button variant="ghost" size="small">
                                        Edit
                                    </Button>
                                }
                            />
                        </div>
                    </section>

                    <section data-label="Dropdown example">
                        <h3>Dropdown</h3>
                        <div style={{ "max-width": "32rem" }}>
                            <SearchableSelect
                                value={selectedOption()}
                                onValueChange={setSelectedOption}
                                placeholder="Select an MCP server"
                                searchPlaceholder="Search MCP servers..."
                                items={[...MCP_OPTIONS]}
                                renderItem={(item, state) => (
                                    <McpOptionCard
                                        name={item.label}
                                        description={item.description}
                                        iconName={item.label}
                                        selected={state.selected}
                                        endContent={
                                            item.actionLabel ? (
                                                <span style={{ "font-size": "var(--small-font-size)" }}>
                                                    {item.actionLabel}
                                                </span>
                                            ) : undefined
                                        }
                                    />
                                )}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
