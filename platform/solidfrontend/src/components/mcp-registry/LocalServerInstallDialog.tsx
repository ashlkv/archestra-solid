import { createSignal, createEffect, For, Show } from "solid-js";
import type { MCP, LocalServerInstallResult } from "@/types";
import { Dialog, DialogContent } from "../primitives/Dialog";
import { Button } from "../primitives/Button";
import { Input } from "../primitives/Input";
import { Textarea } from "../primitives/Textarea";
import { Checkbox } from "../primitives/Checkbox";
import { Separator } from "../primitives/Separator";
import { SelectCredentialTypeAndTeams } from "./SelectCredentialTypeAndTeams";
import styles from "./install-dialog.module.css";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    catalogItem: MCP | null;
    installing: boolean;
    onInstall: (result: LocalServerInstallResult) => Promise<void>;
};

export function LocalServerInstallDialog(props: Props) {
    const [selectedTeamId, setSelectedTeamId] = createSignal<string | null>(null);
    const [serviceAccount, setServiceAccount] = createSignal<string | undefined>(undefined);
    const [environmentValues, setEnvironmentValues] = createSignal<Record<string, string>>({});

    const promptedEnvVars = () =>
        props.catalogItem?.localConfig?.environment?.filter(
            (env) => env.promptOnInstallation === true,
        ) ?? [];

    const secretEnvVars = () =>
        promptedEnvVars().filter(
            (env) => env.type === "secret" && !(env as { mounted?: boolean }).mounted,
        );

    const secretFileVars = () =>
        promptedEnvVars().filter(
            (env) => env.type === "secret" && (env as { mounted?: boolean }).mounted === true,
        );

    const nonSecretEnvVars = () =>
        promptedEnvVars().filter((env) => env.type !== "secret");

    // Reset form when catalog item changes
    createEffect(() => {
        if (props.catalogItem) {
            const initial: Record<string, string> = {};
            for (const env of promptedEnvVars()) {
                const defaultValue = env.default !== undefined ? String(env.default) : "";
                initial[env.key] = env.value || defaultValue;
            }
            setEnvironmentValues(initial);
            setServiceAccount(props.catalogItem.localConfig?.serviceAccount);
        }
    });

    const updateEnvVar = (key: string, value: string) => {
        setEnvironmentValues((previous) => ({ ...previous, [key]: value }));
    };

    const isNonSecretValid = () =>
        nonSecretEnvVars().every((env) => {
            if (!env.required) return true;
            const value = environmentValues()[env.key];
            if (env.type === "boolean") return Boolean(value);
            return Boolean(value?.trim());
        });

    const isSecretsValid = () => {
        const allSecrets = [...secretEnvVars(), ...secretFileVars()];
        if (allSecrets.length === 0) return true;
        return allSecrets.every((env) => {
            if (!env.required) return true;
            return Boolean(environmentValues()[env.key]?.trim());
        });
    };

    const isValid = () => isNonSecretValid() && isSecretsValid();

    const onInstall = async () => {
        if (!props.catalogItem) return;

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

        await props.onInstall({
            environmentValues: finalValues,
            teamId: selectedTeamId(),
            serviceAccount: serviceAccount() || undefined,
        });
    };

    const onClose = () => {
        setSelectedTeamId(null);
        setEnvironmentValues({});
        props.onOpenChange(false);
    };

    return (
        <Dialog open={props.open} onOpenChange={onClose}>
            <DialogContent title={`Install - ${props.catalogItem?.name ?? ""}`}>
                <div class={styles.form}>
                    <Show when={props.catalogItem?.instructions}>
                        <p class={styles.instructions}>{props.catalogItem!.instructions}</p>
                    </Show>

                    <SelectCredentialTypeAndTeams
                        selectedTeamId={selectedTeamId()}
                        onTeamChange={setSelectedTeamId}
                        catalogId={props.catalogItem?.id}
                    />

                    <Show when={props.catalogItem?.localConfig?.serviceAccount !== undefined}>
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

                    {/* Non-secret environment variables */}
                    <Show when={nonSecretEnvVars().length > 0}>
                        <div class={styles.section}>
                            <span class={styles["section-title"]}>Configuration</span>
                            <For each={nonSecretEnvVars()}>
                                {(env) => (
                                    <div class={styles.field}>
                                        <Show when={env.type === "boolean"}>
                                            <div class={styles["field-row"]}>
                                                <Checkbox
                                                    checked={environmentValues()[env.key] === "true"}
                                                    onChange={(checked) => updateEnvVar(env.key, checked ? "true" : "false")}
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
                                            <p class={styles.description}>{env.description}</p>
                                        </Show>
                                        <Show when={env.type !== "boolean"}>
                                            <Input
                                                type={env.type === "number" ? "number" : "text"}
                                                value={environmentValues()[env.key] ?? ""}
                                                onInput={(value) => updateEnvVar(env.key, value)}
                                                placeholder={env.default !== undefined ? String(env.default) : `Enter value for ${env.key}`}
                                                mono
                                                disabled={props.installing}
                                            />
                                        </Show>
                                    </div>
                                )}
                            </For>
                        </div>
                    </Show>

                    {/* Secret environment variables */}
                    <Show when={secretEnvVars().length > 0 || secretFileVars().length > 0}>
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
                                                <p class={styles.description}>{env.description}</p>
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
                                                <p class={styles.description}>{env.description}</p>
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
