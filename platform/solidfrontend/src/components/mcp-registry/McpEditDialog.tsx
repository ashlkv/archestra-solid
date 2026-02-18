import type { archestraApiTypes } from "@shared";
import { createEffect, createSignal, type JSX, Show } from "solid-js";
import { useUpdateMcp } from "@/lib/mcp-registry.query";
import type { MCP } from "@/types";
import { Alert } from "../primitives/Alert";
import { Button } from "../primitives/Button";
import { Dialog, DialogContent } from "../primitives/Dialog";
import { Input } from "../primitives/Input";
import { RadioGroup } from "../primitives/RadioGroup";
import { Separator } from "../primitives/Separator";
import { Spinner } from "../primitives/Spinner";
import { Textarea } from "../primitives/Textarea";
import styles from "./edit-dialog.module.css";
import { McpEnvironmentEditor } from "./McpEnvironmentEditor";

type EnvironmentVariable = NonNullable<NonNullable<MCP["localConfig"]>["environment"]>[number];

type Props = {
    item: MCP;
    onClose: () => void;
};

const authMethodOptions = [
    { value: "none", label: "No authorization" },
    { value: "bearer", label: '"Authorization: Bearer <your token>" header' },
    { value: "raw_token", label: '"Authorization: <your token>" header' },
];

const transportTypeOptions = [
    { value: "stdio", label: "stdio (default)" },
    { value: "streamable-http", label: "Streamable HTTP" },
];

export function McpEditDialog(props: Props): JSX.Element {
    const { submit, submission } = useUpdateMcp();

    // Form state
    const [name, setName] = createSignal("", { name: "name" });
    const [serverUrl, setServerUrl] = createSignal("", { name: "serverUrl" });
    const [authMethod, setAuthMethod] = createSignal<"none" | "bearer" | "raw_token">("none", { name: "authMethod" });
    const [command, setCommand] = createSignal("", { name: "command" });
    const [dockerImage, setDockerImage] = createSignal("", { name: "dockerImage" });
    const [args, setArgs] = createSignal("", { name: "args" });
    const [serviceAccount, setServiceAccount] = createSignal("", { name: "serviceAccount" });
    const [environment, setEnvironment] = createSignal<EnvironmentVariable[]>([], { name: "environment" });
    const [transportType, setTransportType] = createSignal<"stdio" | "streamable-http">("stdio", { name: "transportType" });
    const [httpPort, setHttpPort] = createSignal("", { name: "httpPort" });
    const [httpPath, setHttpPath] = createSignal("/mcp", { name: "httpPath" });

    const isLocal = () => props.item.serverType === "local";
    const isRemote = () => props.item.serverType === "remote";

    // Populate form from item when dialog opens or item changes
    createEffect(() => {
        const item = props.item;
        setName(item.name);
        setServerUrl(item.serverUrl ?? "");
        setAuthMethod(deriveAuthMethod(item));
        setCommand(item.localConfig?.command ?? "");
        setDockerImage(item.localConfig?.dockerImage ?? "");
        setArgs(item.localConfig?.arguments?.join("\n") ?? "");
        setServiceAccount(item.localConfig?.serviceAccount ?? "");
        setEnvironment(item.localConfig?.environment?.map((env) => ({ ...env })) ?? []);
        setTransportType(item.localConfig?.transportType ?? "stdio");
        setHttpPort(item.localConfig?.httpPort?.toString() ?? "");
        setHttpPath(item.localConfig?.httpPath ?? "/mcp");
    });

    // Validation
    const isValid = () => {
        if (!name().trim()) return false;
        if (isRemote() && !serverUrl().trim()) return false;
        if (isLocal() && !command().trim() && !dockerImage().trim()) return false;
        return true;
    };

    const onSave = async () => {
        const body = buildApiBody({
            serverType: props.item.serverType as "local" | "remote",
            name: name(),
            serverUrl: serverUrl(),
            authMethod: authMethod(),
            command: command(),
            dockerImage: dockerImage(),
            args: args(),
            serviceAccount: serviceAccount(),
            environment: environment(),
            transportType: transportType(),
            httpPort: httpPort(),
            httpPath: httpPath(),
        });

        await submit({ id: props.item.id, body });
        props.onClose();
    };

    return (
        <Dialog
            open
            onOpenChange={(open) => {
                if (!open) props.onClose();
            }}
        >
            <DialogContent title={`Edit: ${props.item.name}`} size="large">
                <div class={styles.form}>
                    <Alert>
                        Changes to Name, Server URL, or Authentication will require reinstalling the server for the
                        changes to take effect.
                    </Alert>

                    {/* Name */}
                    <div class={styles.field}>
                        <span class={styles.label}>
                            Name <span class={styles.required}>*</span>
                        </span>
                        <Input
                            value={name()}
                            onInput={setName}
                            placeholder="e.g., GitHub MCP Server"
                            disabled={submission.pending}
                        />
                        <span class={styles.hint}>Display name for this server</span>
                    </div>

                    {/* Remote server fields */}
                    <Show when={isRemote()}>
                        <div class={styles.field}>
                            <span class={styles.label}>
                                Server URL <span class={styles.required}>*</span>
                            </span>
                            <Input
                                value={serverUrl()}
                                onInput={setServerUrl}
                                placeholder="https://api.example.com/mcp"
                                mono
                                disabled={submission.pending}
                            />
                            <span class={styles.hint}>The remote MCP server endpoint</span>
                        </div>

                        <Separator />

                        <div class={styles.field}>
                            <span class={styles.label}>Authentication</span>
                            <RadioGroup
                                value={authMethod()}
                                onChange={(value) => setAuthMethod(value as "none" | "bearer" | "raw_token")}
                                options={authMethodOptions}
                                disabled={submission.pending}
                            />
                        </div>

                        <Show when={authMethod() === "bearer" || authMethod() === "raw_token"}>
                            <div class={styles["info-box"]}>
                                Users will be prompted to provide their access token when installing this server.
                            </div>
                        </Show>
                    </Show>

                    {/* Local server fields */}
                    <Show when={isLocal()}>
                        <div class={styles.field}>
                            <span class={styles.label}>
                                Command
                                <Show when={!dockerImage().trim()}>
                                    <span class={styles.required}> *</span>
                                </Show>
                            </span>
                            <Input
                                value={command()}
                                onInput={setCommand}
                                placeholder="node"
                                mono
                                disabled={submission.pending}
                            />
                            <span class={styles.hint}>
                                The executable command to run. Optional if Docker Image is set (will use image's default
                                CMD).
                            </span>
                        </div>

                        <div class={styles.field}>
                            <span class={styles.label}>Docker Image (optional)</span>
                            <Input
                                value={dockerImage()}
                                onInput={setDockerImage}
                                placeholder="your-registry/image:tag"
                                mono
                                disabled={submission.pending}
                            />
                        </div>

                        <div class={styles.field}>
                            <span class={styles.label}>Arguments (one per line)</span>
                            <Textarea
                                value={args()}
                                onInput={setArgs}
                                placeholder={"/path/to/server.js\n--verbose"}
                                mono
                                rows={3}
                                disabled={submission.pending}
                            />
                            <span class={styles.hint}>Command line arguments, one per line</span>
                        </div>

                        <div class={styles.field}>
                            <span class={styles.label}>Service Account (optional)</span>
                            <Input
                                value={serviceAccount()}
                                onInput={setServiceAccount}
                                placeholder="e.g., archestra-platform-mcp-k8s-operator"
                                mono
                                disabled={submission.pending}
                            />
                            <span class={styles.hint}>Kubernetes service account name for the MCP server pod.</span>
                        </div>

                        <Separator />

                        <McpEnvironmentEditor
                            environment={environment()}
                            onChange={setEnvironment}
                            disabled={submission.pending}
                        />

                        <Separator />

                        <div class={styles.field}>
                            <span class={styles.label}>Transport Type</span>
                            <RadioGroup
                                value={transportType()}
                                onChange={(value) => setTransportType(value as "stdio" | "streamable-http")}
                                options={transportTypeOptions}
                                disabled={submission.pending}
                            />
                            <span class={styles.hint}>
                                stdio uses JSON-RPC over stdin/stdout (serialized requests). Streamable HTTP uses native
                                HTTP/SSE transport (better performance, concurrent requests).
                            </span>
                        </div>

                        <Show when={transportType() === "streamable-http"}>
                            <div class={styles.field}>
                                <span class={styles.label}>HTTP Port (optional)</span>
                                <Input
                                    type="number"
                                    value={httpPort()}
                                    onInput={setHttpPort}
                                    placeholder="8080"
                                    mono
                                    disabled={submission.pending}
                                />
                                <span class={styles.hint}>
                                    Port for HTTP server (defaults to 8080 if not specified)
                                </span>
                            </div>
                            <div class={styles.field}>
                                <span class={styles.label}>HTTP Path (optional)</span>
                                <Input
                                    value={httpPath()}
                                    onInput={setHttpPath}
                                    placeholder="/mcp"
                                    mono
                                    disabled={submission.pending}
                                />
                                <span class={styles.hint}>Endpoint path for MCP requests (defaults to /mcp)</span>
                            </div>
                        </Show>
                    </Show>

                    <div class={styles.footer}>
                        <Button variant="outline" onClick={() => props.onClose()} disabled={submission.pending}>
                            Cancel
                        </Button>
                        <Button onClick={onSave} disabled={!isValid() || submission.pending}>
                            <Show when={submission.pending}>
                                <Spinner size={14} />
                            </Show>
                            {submission.pending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// --- Internal helpers ---

function deriveAuthMethod(item: MCP): "none" | "bearer" | "raw_token" {
    if (item.userConfig && "raw_access_token" in item.userConfig) return "raw_token";
    if (item.userConfig && "access_token" in item.userConfig) return "bearer";
    // If oauthConfig is present, we show "none" for now (OAuth editing is Phase 2)
    return "none";
}

type FormState = {
    serverType: "local" | "remote";
    name: string;
    serverUrl: string;
    authMethod: "none" | "bearer" | "raw_token";
    command: string;
    dockerImage: string;
    args: string;
    serviceAccount: string;
    environment: EnvironmentVariable[];
    transportType: "stdio" | "streamable-http";
    httpPort: string;
    httpPath: string;
};

function buildApiBody(state: FormState): NonNullable<archestraApiTypes.UpdateInternalMcpCatalogItemData["body"]> {
    const body: NonNullable<archestraApiTypes.UpdateInternalMcpCatalogItemData["body"]> = {
        name: state.name.trim(),
    };

    if (state.serverType === "remote") {
        body.serverUrl = state.serverUrl.trim();

        if (state.authMethod === "bearer") {
            body.userConfig = {
                access_token: {
                    type: "string",
                    title: "Access Token",
                    description: "Bearer token for authentication",
                    required: true,
                    sensitive: true,
                },
            };
            body.oauthConfig = undefined;
        } else if (state.authMethod === "raw_token") {
            body.userConfig = {
                raw_access_token: {
                    type: "string",
                    title: "Access Token",
                    description: "Token for authentication (sent without Bearer prefix)",
                    required: true,
                    sensitive: true,
                },
            };
            body.oauthConfig = undefined;
        } else {
            body.userConfig = {};
            body.oauthConfig = undefined;
        }
    }

    if (state.serverType === "local") {
        const argumentsArray = state.args
            .split("\n")
            .map((arg) => arg.trim())
            .filter((arg) => arg.length > 0);

        body.localConfig = {
            command: state.command.trim() || undefined,
            arguments: argumentsArray.length > 0 ? argumentsArray : undefined,
            environment: state.environment,
            dockerImage: state.dockerImage.trim() || undefined,
            transportType: state.transportType || undefined,
            httpPort: state.httpPort ? Number(state.httpPort) : undefined,
            httpPath: state.httpPath.trim() || undefined,
            serviceAccount: state.serviceAccount.trim() || undefined,
        };
    }

    return body;
}
