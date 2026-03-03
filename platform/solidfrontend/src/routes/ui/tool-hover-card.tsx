import type { JSX } from "solid-js";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { ToolHoverCard } from "@/components/tools/ToolHoverCard";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function ToolHoverCardDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "800px", margin: "0 auto" }} data-label="ToolHoverCardDemo">
                <h2>Tool hover card</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Shows tool name, function signature, description, and parameter details on hover.
                </p>
                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="With parameters">
                        <h3>With parameters</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.75rem" }}>
                            Hover to see the function signature and parameter descriptions.
                        </p>
                        <div style={{ display: "flex", gap: "1rem", "align-items": "center" }}>
                            <ToolHoverCard
                                name="search_documents"
                                description="Search through indexed documents using semantic similarity. Returns the top matching documents with relevance scores."
                                parameters={{
                                    type: "object",
                                    properties: {
                                        query: { type: "string", description: "The search query text" },
                                        limit: { type: "number", description: "Maximum number of results to return" },
                                        threshold: {
                                            type: "number",
                                            description: "Minimum similarity score (0-1)",
                                        },
                                    },
                                    required: ["query"],
                                }}
                            >
                                <Badge variant="info" data-label="Tool badge">
                                    search_documents
                                </Badge>
                            </ToolHoverCard>
                        </div>
                    </section>

                    <section data-label="Wrapping a button">
                        <h3>Wrapping a button</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.75rem" }}>
                            The hover card can wrap any element, including buttons.
                        </p>
                        <div style={{ display: "flex", gap: "1rem", "align-items": "center" }}>
                            <ToolHoverCard
                                name="create_user"
                                description="Creates a new user account with the specified details. Sends a welcome email upon creation."
                                parameters={{
                                    type: "object",
                                    properties: {
                                        email: { type: "string", description: "User's email address" },
                                        name: { type: "string", description: "Full name of the user" },
                                        role: {
                                            type: "string",
                                            description: "Role to assign: admin, member, or viewer",
                                        },
                                        sendInvite: {
                                            type: "boolean",
                                            description: "Whether to send an invitation email",
                                        },
                                    },
                                    required: ["email", "name"],
                                }}
                            >
                                <Button variant="outline" size="small" data-label="Tool button">
                                    create_user
                                </Button>
                            </ToolHoverCard>
                        </div>
                    </section>

                    <section data-label="No parameters">
                        <h3>No parameters</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.75rem" }}>
                            A tool with description only and no parameters.
                        </p>
                        <div style={{ display: "flex", gap: "1rem", "align-items": "center" }}>
                            <ToolHoverCard
                                name="get_current_time"
                                description="Returns the current UTC timestamp in ISO 8601 format."
                                parameters={undefined}
                            >
                                <span
                                    style={{
                                        padding: "0.25rem 0.5rem",
                                        border: "1px solid var(--border)",
                                        "border-radius": "0.375rem",
                                        cursor: "default",
                                    }}
                                    data-label="Tool text"
                                >
                                    get_current_time
                                </span>
                            </ToolHoverCard>
                        </div>
                    </section>

                    <section data-label="No description">
                        <h3>No description</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.75rem" }}>
                            A tool with parameters but no description.
                        </p>
                        <div style={{ display: "flex", gap: "1rem", "align-items": "center" }}>
                            <ToolHoverCard
                                name="delete_record"
                                description={null}
                                parameters={{
                                    type: "object",
                                    properties: {
                                        id: { type: "string", description: "Record ID to delete" },
                                        force: { type: "boolean", description: "Skip confirmation" },
                                    },
                                    required: ["id"],
                                }}
                            >
                                <Badge variant="muted" data-label="Tool badge no desc">
                                    delete_record
                                </Badge>
                            </ToolHoverCard>
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
