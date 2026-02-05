import { createSignal, For, Show } from "solid-js";
import { ShieldCheck } from "@/components/icons";
import type { MCP, RemoteServerInstallResult, UserConfigType } from "@/types";
import { Dialog, DialogContent } from "../primitives/Dialog";
import { Button } from "../primitives/Button";
import { Badge } from "../primitives/Badge";
import { Alert } from "../primitives/Alert";
import { Input } from "../primitives/Input";
import { Checkbox } from "../primitives/Checkbox";
import { SelectCredentialTypeAndTeams } from "./SelectCredentialTypeAndTeams";
import styles from "./install-dialog.module.css";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    catalogItem: MCP | null;
    installing: boolean;
    onInstall: (catalogItem: MCP, result: RemoteServerInstallResult) => Promise<void>;
};

export function RemoteServerInstallDialog(props: Props) {
    const [configValues, setConfigValues] = createSignal<Record<string, string>>({});
    const [selectedTeamId, setSelectedTeamId] = createSignal<string | null>(null);

    const userConfig = () =>
        (props.catalogItem?.userConfig as UserConfigType | null | undefined) ?? {};

    const configEntries = () => Object.entries(userConfig());
    const hasConfig = () => configEntries().length > 0;
    const hasOAuth = () => Boolean(props.catalogItem?.oauthConfig);

    const requiredFields = () =>
        configEntries().filter(([_, config]) => config.required && !config.sensitive);

    const sensitiveRequiredFields = () =>
        configEntries().filter(([_, config]) => config.required && config.sensitive);

    const isNonSensitiveValid = () =>
        requiredFields().every(([fieldName]) => configValues()[fieldName]?.trim());

    const isSensitiveValid = () =>
        sensitiveRequiredFields().every(([fieldName]) => configValues()[fieldName]?.trim());

    const isValid = () => !hasConfig() || (isNonSensitiveValid() && isSensitiveValid());

    const updateConfig = (fieldName: string, value: string) => {
        setConfigValues((previous) => ({ ...previous, [fieldName]: value }));
    };

    const onConfirm = async () => {
        if (!props.catalogItem) return;

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
    };

    const onClose = () => {
        setConfigValues({});
        setSelectedTeamId(null);
        props.onOpenChange(false);
    };

    return (
        <Dialog open={props.open} onOpenChange={onClose}>
            <DialogContent title={`Install server`}>
                <div class={styles.form}>
                    <div class={styles["title-row"]}>
                        <span>
                            Install server
                            <span class={styles["title-name"]}>{props.catalogItem?.name}</span>
                        </span>
                        <Show when={hasOAuth()}>
                            <Badge variant="secondary" class={styles["oauth-badge"]}>
                                <ShieldCheck size={12} />
                                OAuth
                            </Badge>
                        </Show>
                    </div>

                    <SelectCredentialTypeAndTeams
                        selectedTeamId={selectedTeamId()}
                        onTeamChange={setSelectedTeamId}
                        catalogId={props.catalogItem?.id}
                    />

                    <Show when={hasOAuth()}>
                        <Alert>
                            This server requires OAuth authentication. You'll be redirected
                            to complete the authentication flow after clicking install.
                        </Alert>
                    </Show>

                    <Show when={hasConfig()}>
                        <div class={styles.section}>
                            <For each={configEntries()}>
                                {([fieldName, fieldConfig]) => (
                                    <div class={styles.field}>
                                        <Show when={fieldConfig.type === "boolean"}>
                                            <div class={styles["field-row"]}>
                                                <Checkbox
                                                    checked={configValues()[fieldName] === "true"}
                                                    onChange={(checked) => updateConfig(fieldName, checked ? "true" : "false")}
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
                                            <p class={styles.description}>{fieldConfig.description}</p>
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

                    <Show when={props.catalogItem?.serverUrl}>
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
                        <Button onClick={onConfirm} disabled={!isValid() || props.installing}>
                            {props.installing ? "Installing..." : "Install"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
