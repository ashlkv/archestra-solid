import { For, Match, Show, Switch } from "solid-js";
import { Key, Plus } from "lucide-solid";
import type { McpServer } from "@/types";
import { Button } from "../primitives/Button";
import { Dialog, DialogContent } from "../primitives/Dialog";
import styles from "./McpInstallationsDialog.module.css";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    serverName: string;
    instances: McpServer[];
    onInstall?: () => void;
    onUninstall?: (serverId: string) => void;
};

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

function getInstanceLabel(instance: McpServer): string {
    if (instance.userDetails?.[0]?.email) {
        return instance.userDetails[0].email;
    }
    if (instance.teamDetails?.name) {
        return instance.teamDetails.name;
    }
    return instance.ownerEmail ?? "Unknown";
}

// Returns human-readable label for secret storage type.
// For local servers, secrets are injected as K8s Secrets regardless of storage type.
function getStorageLabel(type: McpServer["secretStorageType"]): string {
    switch (type) {
        case "vault":
            return "Vault";
        case "external_vault":
            return "external Vault";
        case "database":
            return "database";
        default:
            return null;
    }
}

export function McpInstallationsDialog(props: Props) {
    const onUninstall = (serverId: string) => {
        props.onUninstall?.(serverId);
    };

    return (
        <Dialog open={props.open} onOpenChange={props.onOpenChange}>
            <DialogContent title={`Manage installations: ${props.serverName}`}>
                <div class={styles.content}>
                    <Show when={props.instances.length === 0}>
                        <p class={styles.empty}>No installations yet</p>
                    </Show>
                    <Show when={props.instances.length > 0}>
                        <div class={styles.instances}>
                            <For each={props.instances}>
                                {(instance) => (
                                    <div class={styles.instance}>
                                        <div class={styles.details}>
                                            <p class={styles.label}>{getInstanceLabel(instance)}</p>
                                            <p class={styles.meta}>Installed: {formatDate(instance.createdAt)}</p>
                                            <div class={styles.storage}>
                                                <Key size={14} class={styles["storage-icon"]} />
                                                <Switch fallback={<span>No secrets configured</span>}>
                                                    <Match when={getStorageLabel(instance.secretStorageType)}>
                                                        <span>Secrets in <strong>{getStorageLabel(instance.secretStorageType)}</strong></span>
                                                    </Match>
                                                </Switch>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="small" onClick={() => onUninstall(instance.id)}>
                                            Uninstall
                                        </Button>
                                    </div>
                                )}
                            </For>
                        </div>
                    </Show>
                    <div class={styles.footer}>
                        <Button variant="default" onClick={props.onInstall}>
                            <Plus size={16} />
                            New instance
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
