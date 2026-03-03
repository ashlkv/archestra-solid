import type { JSX } from "solid-js";
import { McpCard } from "@/components/mcp-registry/McpCard";
import { UiLayout } from "@/components/ui-demo/UiLayout";
import type { MCP, McpServer } from "@/types";

const remoteMcp: MCP = {
    id: "demo-remote-1",
    name: "GitHub",
    version: "1.2.0",
    description: "Access GitHub repositories, issues, pull requests, and more through the GitHub API.",
    instructions: null,
    repository: "https://github.com/modelcontextprotocol/servers",
    installationCommand: null,
    requiresAuth: true,
    authDescription: "Requires a GitHub personal access token.",
    authFields: [{ name: "token", label: "Personal access token", type: "string", required: true }],
    serverType: "remote",
    serverUrl: "https://mcp.github.com",
    docsUrl: "https://docs.github.com",
    clientSecretId: null,
    localConfigSecretId: null,
    localConfig: null,
    deploymentSpecYaml: null,
    userConfig: null,
    oauthConfig: null,
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-02-20T14:30:00Z",
};

const localMcp: MCP = {
    id: "demo-local-1",
    name: "Filesystem",
    version: "0.5.0",
    description: "Read, write, and manage files on the local filesystem with configurable access controls.",
    instructions: null,
    repository: null,
    installationCommand: "npx @modelcontextprotocol/server-filesystem",
    requiresAuth: false,
    authDescription: null,
    authFields: null,
    serverType: "local",
    serverUrl: null,
    docsUrl: null,
    clientSecretId: null,
    localConfigSecretId: null,
    localConfig: {
        command: "npx",
        arguments: ["@modelcontextprotocol/server-filesystem", "/workspace"],
        transportType: "stdio",
    },
    deploymentSpecYaml: null,
    userConfig: null,
    oauthConfig: null,
    createdAt: "2025-01-10T08:00:00Z",
    updatedAt: "2025-01-10T08:00:00Z",
};

const builtinMcp: MCP = {
    id: "demo-builtin-1",
    name: "Archestra",
    version: "1.0.0",
    description: "Built-in Archestra tools for managing agents, proxies, gateways, and policies.",
    instructions: null,
    repository: null,
    installationCommand: null,
    requiresAuth: false,
    authDescription: null,
    authFields: null,
    serverType: "builtin",
    serverUrl: null,
    docsUrl: null,
    clientSecretId: null,
    localConfigSecretId: null,
    localConfig: null,
    deploymentSpecYaml: null,
    userConfig: null,
    oauthConfig: null,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
};

const mockInstances: McpServer[] = [
    {
        id: "inst-1",
        name: "GitHub",
        catalogId: "demo-remote-1",
        serverType: "remote",
        secretId: "secret-1",
        ownerId: "user-1",
        teamId: null,
        reinstallRequired: false,
        localInstallationStatus: "idle",
        localInstallationError: null,
        oauthRefreshError: undefined as never,
        oauthRefreshFailedAt: null,
        createdAt: "2025-02-01T09:00:00Z",
        updatedAt: "2025-02-01T09:00:00Z",
        ownerEmail: "alice@example.com",
        userDetails: [{ userId: "user-1", email: "alice@example.com", createdAt: "2025-02-01T09:00:00Z" }],
        teamDetails: null,
        secretStorageType: "database",
    },
    {
        id: "inst-2",
        name: "GitHub",
        catalogId: "demo-remote-1",
        serverType: "remote",
        secretId: "secret-2",
        ownerId: "user-2",
        teamId: "team-1",
        reinstallRequired: false,
        localInstallationStatus: "idle",
        localInstallationError: null,
        oauthRefreshError: undefined as never,
        oauthRefreshFailedAt: null,
        createdAt: "2025-02-10T12:00:00Z",
        updatedAt: "2025-02-10T12:00:00Z",
        ownerEmail: "bob@example.com",
        userDetails: [{ userId: "user-2", email: "bob@example.com", createdAt: "2025-02-10T12:00:00Z" }],
        teamDetails: { teamId: "team-1", name: "Engineering", createdAt: "2025-01-01T00:00:00Z" },
        secretStorageType: "vault",
    },
];

export default function McpCardDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "1000px", margin: "0 auto" }} data-label="McpCardDemo">
                <h2>MCP card</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Card component for displaying MCP servers in the registry. Shows server name, type badges,
                    description, and installation actions.
                </p>
                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Not installed">
                        <h3>Not installed</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.75rem" }}>
                            A remote server that hasn't been installed yet.
                        </p>
                        <div
                            style={{
                                display: "grid",
                                "grid-template-columns": "repeat(auto-fill, minmax(300px, 1fr))",
                                gap: "1rem",
                            }}
                        >
                            <McpCard
                                item={remoteMcp}
                                onInstall={() => console.log("Install remote")}
                                onAbout={() => console.log("About remote")}
                            />
                        </div>
                    </section>

                    <section data-label="Installed with single instance">
                        <h3>Installed (single instance)</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.75rem" }}>
                            A remote server with one installation, showing the credential label.
                        </p>
                        <div
                            style={{
                                display: "grid",
                                "grid-template-columns": "repeat(auto-fill, minmax(300px, 1fr))",
                                gap: "1rem",
                            }}
                        >
                            <McpCard
                                item={remoteMcp}
                                instances={[mockInstances[0]]}
                                onInstall={() => console.log("New instance")}
                                onEdit={() => console.log("Edit")}
                                onAbout={() => console.log("About")}
                                onUninstall={(id) => console.log("Uninstall:", id)}
                            />
                        </div>
                    </section>

                    <section data-label="Installed with multiple instances">
                        <h3>Installed (multiple instances)</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.75rem" }}>
                            A server with multiple installations shows stacked cards and "various credentials".
                        </p>
                        <div
                            style={{
                                display: "grid",
                                "grid-template-columns": "repeat(auto-fill, minmax(300px, 1fr))",
                                gap: "1rem",
                            }}
                        >
                            <McpCard
                                item={remoteMcp}
                                instances={mockInstances}
                                onInstall={() => console.log("New instance")}
                                onManageInstallations={() => console.log("Manage")}
                                onEdit={() => console.log("Edit")}
                                onAbout={() => console.log("About")}
                                onUninstall={(id) => console.log("Uninstall:", id)}
                            />
                        </div>
                    </section>

                    <section data-label="Local server">
                        <h3>Local server</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.75rem" }}>
                            A locally-running server with stdio transport.
                        </p>
                        <div
                            style={{
                                display: "grid",
                                "grid-template-columns": "repeat(auto-fill, minmax(300px, 1fr))",
                                gap: "1rem",
                            }}
                        >
                            <McpCard
                                item={localMcp}
                                onInstall={() => console.log("Install local")}
                                onAbout={() => console.log("About local")}
                            />
                        </div>
                    </section>

                    <section data-label="Built-in server">
                        <h3>Built-in server</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.75rem" }}>
                            Native servers cannot be installed or deleted.
                        </p>
                        <div
                            style={{
                                display: "grid",
                                "grid-template-columns": "repeat(auto-fill, minmax(300px, 1fr))",
                                gap: "1rem",
                            }}
                        >
                            <McpCard item={builtinMcp} />
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
