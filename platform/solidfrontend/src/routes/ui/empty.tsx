import type { JSX } from "solid-js";
import { FileText, Search, Server } from "@/components/icons";
import { Button } from "@/components/primitives/Button";
import { Empty, EmptyContent, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/primitives/Empty";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function EmptyDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="EmptyDemo">
                <h2>Empty</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Placeholder for empty states with icon, title, description, and optional actions.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Basic empty state">
                        <h3>Basic empty state</h3>
                        <Empty>
                            <EmptyMedia>
                                <FileText size={48} />
                            </EmptyMedia>
                            <EmptyTitle>No documents</EmptyTitle>
                            <EmptyDescription>You have not created any documents yet.</EmptyDescription>
                        </Empty>
                    </section>

                    <section data-label="With action button">
                        <h3>With action button</h3>
                        <Empty>
                            <EmptyMedia>
                                <Server size={48} />
                            </EmptyMedia>
                            <EmptyTitle>No servers found</EmptyTitle>
                            <EmptyDescription>Get started by adding your first MCP server.</EmptyDescription>
                            <EmptyContent>
                                <Button>Add server</Button>
                            </EmptyContent>
                        </Empty>
                    </section>

                    <section data-label="Search empty state">
                        <h3>Search empty state</h3>
                        <Empty>
                            <EmptyMedia>
                                <Search size={48} />
                            </EmptyMedia>
                            <EmptyTitle>No results</EmptyTitle>
                            <EmptyDescription>No items match your search. Try a different query.</EmptyDescription>
                        </Empty>
                    </section>

                    <section data-label="Minimal (title only)">
                        <h3>Minimal (title only)</h3>
                        <Empty>
                            <EmptyTitle>Nothing here yet</EmptyTitle>
                        </Empty>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
