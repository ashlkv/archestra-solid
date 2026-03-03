import type { JSX } from "solid-js";
import { McpInstanceHoverCard } from "@/components/mcp-registry/McpInstanceHoverCard";
import { Badge } from "@/components/primitives/Badge";
import { UiLayout } from "@/components/ui-demo/UiLayout";
import type { McpServer } from "@/types";

const databaseInstance: McpServer = {
    id: "inst-db-1",
    name: "GitHub",
    catalogId: "cat-1",
    serverType: "remote",
    secretId: "secret-1",
    ownerId: "user-1",
    teamId: null,
    reinstallRequired: false,
    localInstallationStatus: "idle",
    localInstallationError: null,
    oauthRefreshError: undefined as never,
    oauthRefreshFailedAt: null,
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-01-15T10:30:00Z",
    ownerEmail: "alice@example.com",
    userDetails: [{ userId: "user-1", email: "alice@example.com", createdAt: "2025-01-15T10:30:00Z" }],
    teamDetails: null,
    secretStorageType: "database",
};

const vaultInstance: McpServer = {
    id: "inst-vault-1",
    name: "GitHub",
    catalogId: "cat-1",
    serverType: "remote",
    secretId: "secret-2",
    ownerId: "user-2",
    teamId: "team-1",
    reinstallRequired: false,
    localInstallationStatus: "idle",
    localInstallationError: null,
    oauthRefreshError: undefined as never,
    oauthRefreshFailedAt: null,
    createdAt: "2025-02-20T14:00:00Z",
    updatedAt: "2025-02-20T14:00:00Z",
    ownerEmail: "bob@example.com",
    userDetails: [{ userId: "user-2", email: "bob@example.com", createdAt: "2025-02-20T14:00:00Z" }],
    teamDetails: { teamId: "team-1", name: "Engineering", createdAt: "2025-01-01T00:00:00Z" },
    secretStorageType: "vault",
};

const noSecretsInstance: McpServer = {
    id: "inst-none-1",
    name: "Filesystem",
    catalogId: "cat-2",
    serverType: "local",
    secretId: null,
    ownerId: "user-3",
    teamId: null,
    reinstallRequired: false,
    localInstallationStatus: "success",
    localInstallationError: null,
    oauthRefreshError: undefined as never,
    oauthRefreshFailedAt: null,
    createdAt: "2025-03-01T08:00:00Z",
    updatedAt: "2025-03-01T08:00:00Z",
    ownerEmail: "carol@example.com",
    userDetails: [{ userId: "user-3", email: "carol@example.com", createdAt: "2025-03-01T08:00:00Z" }],
    teamDetails: null,
    secretStorageType: "none",
};

export default function McpInstanceHoverCardDemo(): JSX.Element {
    return (
        <UiLayout>
            <div
                style={{ padding: "2rem", "max-width": "800px", margin: "0 auto" }}
                data-label="McpInstanceHoverCardDemo"
            >
                <h2>MCP instance hover card</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Hover card showing installation details for MCP server instances, including owner, date, secret
                    storage, and an uninstall action.
                </p>
                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Single instance">
                        <h3>Single instance</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.75rem" }}>
                            Hover the badge to see details for a single installation with database secret storage.
                        </p>
                        <McpInstanceHoverCard
                            instances={[databaseInstance]}
                            onUninstall={(id) => console.log("Uninstall:", id)}
                        >
                            <Badge variant="info" data-label="Single instance badge">
                                alice@example.com
                            </Badge>
                        </McpInstanceHoverCard>
                    </section>

                    <section data-label="Multiple instances">
                        <h3>Multiple instances</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.75rem" }}>
                            Hover to see a list of all installations with different secret storage types.
                        </p>
                        <McpInstanceHoverCard
                            instances={[databaseInstance, vaultInstance, noSecretsInstance]}
                            onUninstall={(id) => console.log("Uninstall:", id)}
                        >
                            <span
                                style={{
                                    "text-decoration": "underline dotted",
                                    cursor: "pointer",
                                    color: "var(--muted-foreground)",
                                }}
                                data-label="Multiple instances trigger"
                            >
                                3 installations
                            </span>
                        </McpInstanceHoverCard>
                    </section>

                    <section data-label="Team-owned instance">
                        <h3>Team-owned instance</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.75rem" }}>
                            An instance owned by a team, with Vault secret storage.
                        </p>
                        <McpInstanceHoverCard
                            instances={[vaultInstance]}
                            onUninstall={(id) => console.log("Uninstall:", id)}
                        >
                            <Badge variant="success" data-label="Team instance badge">
                                Engineering
                            </Badge>
                        </McpInstanceHoverCard>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
