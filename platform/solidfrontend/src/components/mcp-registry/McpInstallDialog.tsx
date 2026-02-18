import { createEffect, createSignal, For, Match, Show, Switch } from "solid-js";
import { ShieldCheck } from "@/components/icons";
import type { MCP, UserConfigType } from "@/types";
import { Alert } from "../primitives/Alert";
import { Badge } from "../primitives/Badge";
import { Button } from "../primitives/Button";
import { Checkbox } from "../primitives/Checkbox";
import { Dialog, DialogContent } from "../primitives/Dialog";
import { Input } from "../primitives/Input";
import { Markdown } from "../primitives/Markdown";
import { Separator } from "../primitives/Separator";
import { Textarea } from "../primitives/Textarea";
import styles from "./install-dialog.module.css";
import { SelectCredentialTypeAndTeams } from "./SelectCredentialTypeAndTeams";

type InstallResult = {
    teamId: string | undefined;
    environmentValues?: Record<string, string>;
    serviceAccount?: string;
    metadata?: Record<string, unknown>;
};

type Props = {
    onClose: () => void;
    catalogItem: MCP;
    installing: boolean;
    onInstall: (catalogItem: MCP, result: InstallResult) => Promise<void>;
};

export function McpInstallDialog(props: Props) {
    const [selectedTeamId, setSelectedTeamId] = createSignal<string | undefined>(undefined, { name: "selectedTeamId" });
    const [serviceAccount, setServiceAccount] = createSignal<string | undefined>(undefined, { name: "serviceAccount" });
    const [environmentValues, setEnvironmentValues] = createSignal<Record<string, string>>({}, { name: "environmentValues" });
    const [configValues, setConfigValues] = createSignal<Record<string, string>>({}, { name: "configValues" });

    const isLocal = () => props.catalogItem?.serverType === "local";
    const isRemote = () => props.catalogItem?.serverType === "remote";

    // Remote server config
    const userConfig = () => (props.catalogItem?.userConfig as UserConfigType | undefined) ?? {};
    const configEntries = () => Object.entries(userConfig());
    const hasConfig = () => configEntries().length > 0;
    const hasOAuth = () => Boolean(props.catalogItem?.oauthConfig);
    const requiresAuth = () => props.catalogItem?.requiresAuth || hasOAuth() || hasConfig();

    // Local server env vars
    const promptedEnvVars = () =>
        props.catalogItem?.localConfig?.environment?.filter((env) => env.promptOnInstallation === true) ?? [];

    const secretEnvVars = () =>
        promptedEnvVars().filter((env) => env.type === "secret" && !(env as { mounted?: boolean }).mounted);

    const secretFileVars = () =>
        promptedEnvVars().filter((env) => env.type === "secret" && (env as { mounted?: boolean }).mounted === true);

    const nonSecretEnvVars = () => promptedEnvVars().filter((env) => env.type !== "secret");

    // Reset form when catalog item changes
    createEffect(() => {
        if (props.catalogItem) {
            // Reset local server fields
            const initialEnv: Record<string, string> = {};
            for (const env of promptedEnvVars()) {
                const defaultValue = env.default !== undefined ? String(env.default) : "";
                initialEnv[env.key] = env.value || defaultValue;
            }
            setEnvironmentValues(initialEnv);
            setServiceAccount(props.catalogItem.localConfig?.serviceAccount);

            // Reset remote server fields
            setConfigValues({});
        }
    });

    const updateEnvVar = (key: string, value: string) => {
        setEnvironmentValues((previous) => ({ ...previous, [key]: value }));
    };

    const updateConfig = (fieldName: string, value: string) => {
        setConfigValues((previous) => ({ ...previous, [fieldName]: value }));
    };

    // Validation for local servers
    const isLocalEnvValid = () => {
        const nonSecretValid = nonSecretEnvVars().every((env) => {
            if (!env.required) return true;
            const value = environmentValues()[env.key];
            if (env.type === "boolean") return Boolean(value);
            return Boolean(value?.trim());
        });

        const allSecrets = [...secretEnvVars(), ...secretFileVars()];
        const secretsValid =
            allSecrets.length === 0 ||
            allSecrets.every((env) => {
                if (!env.required) return true;
                return Boolean(environmentValues()[env.key]?.trim());
            });

        return nonSecretValid && secretsValid;
    };

    // Validation for remote servers with config
    const requiredFields = () =>
        configEntries().filter(([_, fieldConfig]) => fieldConfig.required && !fieldConfig.sensitive);

    const sensitiveRequiredFields = () =>
        configEntries().filter(([_, fieldConfig]) => fieldConfig.required && fieldConfig.sensitive);

    const isRemoteConfigValid = () => {
        if (!hasConfig()) return true;
        const nonSensitiveValid = requiredFields().every(([fieldName]) => configValues()[fieldName]?.trim());
        const sensitiveValid = sensitiveRequiredFields().every(([fieldName]) => configValues()[fieldName]?.trim());
        return nonSensitiveValid && sensitiveValid;
    };

    const isValid = () => {
        if (isLocal()) return isLocalEnvValid();
        if (isRemote() && requiresAuth()) return isRemoteConfigValid();
        return true;
    };

    const onInstall = async () => {
        if (!props.catalogItem) return;

        if (isLocal()) {
            const finalValues: Record<string, string> = {};
            for (const env of nonSecretEnvVars()) {
                if (environmentValues()[env.key]) {
                    finalValues[env.key] = environmentValues()[env.key];
                }
            }
            for (const env of [...secretEnvVars(), ...secretFileVars()]) {
                if (environmentValues()[env.key]) {
                    finalValues[env.key] = environmentValues()[env.key];
                }
            }

            await props.onInstall(props.catalogItem, {
                environmentValues: finalValues,
                teamId: selectedTeamId(),
                serviceAccount: serviceAccount() || undefined,
            });
        } else if (isRemote() && requiresAuth()) {
            const metadata: Record<string, unknown> = {};
            for (const [fieldName, fieldConfig] of configEntries()) {
                const value = configValues()[fieldName];
                if (value !== undefined && value !== "") {
                    switch (fieldConfig.type) {
                        case "number":
                            metadata[fieldName] = Number(value);
                            break;
                        case "boolean":
                            metadata[fieldName] = value === "true";
                            break;
                        default:
                            metadata[fieldName] = value;
                    }
                }
            }

            await props.onInstall(props.catalogItem, {
                metadata,
                teamId: selectedTeamId(),
            });
        } else {
            await props.onInstall(props.catalogItem, {
                teamId: selectedTeamId(),
            });
        }
    };

    const onClose = () => {
        setSelectedTeamId(undefined);
        setEnvironmentValues({});
        setConfigValues({});
        setServiceAccount(undefined);
        props.onClose();
    };

    return (
        <Dialog
            open
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent title={`Install ${props.catalogItem.name}`} size="medium">
                <div class={styles.form} data-label="Install form">
                    {/* Title row with OAuth badge for remote servers */}
                    <Show when={isRemote() && hasOAuth()}>
                        <div class={styles["title-row"]}>
                            <Badge variant="secondary" class={styles["oauth-badge"]}>
                                <ShieldCheck size={12} />
                                OAuth
                            </Badge>
                        </div>
                    </Show>

                    {/* Instructions */}
                    <Show when={props.catalogItem?.instructions}>
                        <Markdown class={styles.instructions}>{props.catalogItem!.instructions}</Markdown>
                    </Show>

                    {/* No auth description for simple remote servers */}
                    <Show when={isRemote() && !requiresAuth()}>
                        <p class={styles["no-auth-description"]}>
                            This MCP server doesn't require authentication. Click install to proceed.
                        </p>
                    </Show>

                    {/* Team selection - always shown */}
                    <SelectCredentialTypeAndTeams
                        selectedTeamId={selectedTeamId()}
                        onTeamChange={setSelectedTeamId}
                        catalogId={props.catalogItem?.id}
                    />

                    {/* OAuth alert for remote servers */}
                    <Show when={isRemote() && hasOAuth()}>
                        <Alert>
                            This server requires OAuth authentication. You'll be redirected to complete the
                            authentication flow after clicking install.
                        </Alert>
                    </Show>

                    {/* Local server: Service account */}
                    <Show when={isLocal() && props.catalogItem?.localConfig?.serviceAccount !== undefined}>
                        <div class={styles["service-account-field"]}>
                            <span class={styles.label}>Service account</span>
                            <Input
                                value={serviceAccount() ?? ""}
                                onInput={setServiceAccount}
                                placeholder="e.g., archestra-platform-mcp-k8s-operator"
                                mono
                                disabled={props.installing}
                            />
                            <p class={styles["service-account-hint"]}>
                                Kubernetes service account name for the MCP server pod.
                            </p>
                        </div>
                    </Show>

                    {/* Local server: Non-secret environment variables */}
                    <Show when={isLocal() && nonSecretEnvVars().length > 0}>
                        <div class={styles.section}>
                            <span class={styles["section-title"]}>Configuration</span>
                            <For each={nonSecretEnvVars()}>
                                {(env) => (
                                    <div class={styles.field}>
                                        <Show when={env.type === "boolean"}>
                                            <div class={styles["field-row"]}>
                                                <Checkbox
                                                    checked={environmentValues()[env.key] === "true"}
                                                    onChange={(checked) =>
                                                        updateEnvVar(env.key, checked ? "true" : "false")
                                                    }
                                                    disabled={props.installing}
                                                />
                                                <span class={styles.label}>
                                                    {env.key}
                                                    <Show when={env.required}>
                                                        <span class={styles.required}> *</span>
                                                    </Show>
                                                </span>
                                            </div>
                                        </Show>
                                        <Show when={env.type !== "boolean"}>
                                            <span class={styles.label}>
                                                {env.key}
                                                <Show when={env.required}>
                                                    <span class={styles.required}> *</span>
                                                </Show>
                                            </span>
                                        </Show>
                                        <Show when={env.description}>
                                            <Markdown class={styles.description}>{env.description}</Markdown>
                                        </Show>
                                        <Show when={env.type !== "boolean"}>
                                            <Input
                                                type={env.type === "number" ? "number" : "text"}
                                                value={environmentValues()[env.key] ?? ""}
                                                onInput={(value) => updateEnvVar(env.key, value)}
                                                placeholder={
                                                    env.default !== undefined
                                                        ? String(env.default)
                                                        : `Enter value for ${env.key}`
                                                }
                                                mono
                                                disabled={props.installing}
                                            />
                                        </Show>
                                    </div>
                                )}
                            </For>
                        </div>
                    </Show>

                    {/* Local server: Secret environment variables */}
                    <Show when={isLocal() && (secretEnvVars().length > 0 || secretFileVars().length > 0)}>
                        <Show when={nonSecretEnvVars().length > 0}>
                            <Separator />
                        </Show>
                        <div class={styles.section}>
                            <span class={styles["section-title"]}>Secrets</span>

                            <Show when={secretEnvVars().length > 0}>
                                <span class={styles["section-subtitle"]}>Environment variables</span>
                                <For each={secretEnvVars()}>
                                    {(env) => (
                                        <div class={styles.field}>
                                            <span class={styles.label}>
                                                {env.key}
                                                <Show when={env.required}>
                                                    <span class={styles.required}> *</span>
                                                </Show>
                                            </span>
                                            <Show when={env.description}>
                                                <Markdown class={styles.description}>{env.description}</Markdown>
                                            </Show>
                                            <Input
                                                type="password"
                                                value={environmentValues()[env.key] ?? ""}
                                                onInput={(value) => updateEnvVar(env.key, value)}
                                                placeholder={`Enter value for ${env.key}`}
                                                mono
                                                disabled={props.installing}
                                            />
                                        </div>
                                    )}
                                </For>
                            </Show>

                            <Show when={secretFileVars().length > 0}>
                                <Show when={secretEnvVars().length > 0}>
                                    <Separator />
                                </Show>
                                <span class={styles["section-subtitle"]}>Files</span>
                                <For each={secretFileVars()}>
                                    {(env) => (
                                        <div class={styles.field}>
                                            <span class={styles.label}>
                                                {env.key}
                                                <Show when={env.required}>
                                                    <span class={styles.required}> *</span>
                                                </Show>
                                            </span>
                                            <Show when={env.description}>
                                                <Markdown class={styles.description}>{env.description}</Markdown>
                                            </Show>
                                            <Textarea
                                                value={environmentValues()[env.key] ?? ""}
                                                onInput={(value) => updateEnvVar(env.key, value)}
                                                mono
                                                rows={3}
                                                disabled={props.installing}
                                            />
                                        </div>
                                    )}
                                </For>
                            </Show>
                        </div>
                    </Show>

                    {/* Remote server: User config fields */}
                    <Show when={isRemote() && hasConfig()}>
                        <div class={styles.section}>
                            <For each={configEntries()}>
                                {([fieldName, fieldConfig]) => (
                                    <div class={styles.field}>
                                        <Show when={fieldConfig.type === "boolean"}>
                                            <div class={styles["field-row"]}>
                                                <Checkbox
                                                    checked={configValues()[fieldName] === "true"}
                                                    onChange={(checked) =>
                                                        updateConfig(fieldName, checked ? "true" : "false")
                                                    }
                                                />
                                                <span class={styles.label}>
                                                    {fieldConfig.title}
                                                    <Show when={fieldConfig.required}>
                                                        <span class={styles.required}> *</span>
                                                    </Show>
                                                </span>
                                            </div>
                                        </Show>
                                        <Show when={fieldConfig.type !== "boolean"}>
                                            <span class={styles.label}>
                                                {fieldConfig.title}
                                                <Show when={fieldConfig.required}>
                                                    <span class={styles.required}> *</span>
                                                </Show>
                                            </span>
                                        </Show>
                                        <Show when={fieldConfig.description}>
                                            <Markdown class={styles.description}>{fieldConfig.description}</Markdown>
                                        </Show>
                                        <Show when={fieldConfig.type !== "boolean"}>
                                            <Input
                                                type={
                                                    fieldConfig.sensitive
                                                        ? "password"
                                                        : fieldConfig.type === "number"
                                                          ? "number"
                                                          : "text"
                                                }
                                                value={configValues()[fieldName] ?? ""}
                                                onInput={(value) => updateConfig(fieldName, value)}
                                                placeholder={fieldConfig.default?.toString() ?? fieldConfig.description}
                                                min={fieldConfig.min}
                                                max={fieldConfig.max}
                                            />
                                        </Show>
                                    </div>
                                )}
                            </For>
                        </div>
                    </Show>

                    {/* Remote server: Server details */}
                    <Show when={isRemote() && props.catalogItem?.serverUrl}>
                        <div class={styles.details}>
                            <p class={styles["details-title"]}>Server details:</p>
                            <p class={styles["details-row"]}>
                                <strong>URL:</strong> {props.catalogItem!.serverUrl}
                            </p>
                            <Show when={props.catalogItem?.docsUrl}>
                                <p class={styles["details-row"]}>
                                    <strong>Documentation:</strong>{" "}
                                    <a href={props.catalogItem!.docsUrl!} target="_blank" rel="noopener noreferrer">
                                        {props.catalogItem!.docsUrl}
                                    </a>
                                </p>
                            </Show>
                        </div>
                    </Show>

                    <div class={styles.footer}>
                        <Button variant="outline" onClick={onClose} disabled={props.installing}>
                            Cancel
                        </Button>
                        <Button onClick={onInstall} disabled={!isValid() || props.installing}>
                            {props.installing ? "Installing..." : "Install"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
