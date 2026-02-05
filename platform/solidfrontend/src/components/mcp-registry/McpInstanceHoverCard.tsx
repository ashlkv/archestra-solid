import { For, Match, Switch } from "solid-js";
import { Key } from "@/components/icons";
import type { McpServer } from "@/types";
import { Button } from "../primitives/Button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../primitives/HoverCard";
import styles from "./McpInstanceHoverCard.module.css";

type Props = {
    instances: McpServer[];
    onUninstall?: (serverId: string) => void;
    children: import("solid-js").JSX.Element;
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

export function McpInstanceHoverCard(props: Props) {
    const onUninstall = (serverId: string, event: MouseEvent) => {
        event.stopPropagation();
        props.onUninstall?.(serverId);
    };

    return (
        <HoverCard>
            <HoverCardTrigger>{props.children}</HoverCardTrigger>
            <HoverCardContent class={styles.content}>
                <div class={styles.instances}>
                    <For each={props.instances}>
                        {(instance) => (
                            <div class={styles.instance}>
                                <div class={styles.details}>
                                    <p class={styles.email}>{getInstanceLabel(instance)}</p>
                                    <p class={styles.meta}>Installed: {formatDate(instance.createdAt)}</p>
                                    {/* Secret storage type indicates where secrets are stored/managed:
                                        - "none": Secrets weren't provided during installation (optional)
                                        - "database": Secrets stored in Archestra database
                                        - "vault": Secrets stored in Archestra-managed HashiCorp Vault
                                        - "external_vault": Secrets stored in customer's external Vault (BYOS)
                                        For local servers, secrets are always injected as K8s Secrets. */}
                                    <div class={styles.storage}>
                                        <Key size={14} class={styles["storage-icon"]} />
                                        <Switch fallback={<span>No secrets configured</span>}>
                                            <Match when={instance.secretStorageType === "vault"}>
                                                <span>Secrets in <strong>Vault</strong></span>
                                            </Match>
                                            <Match when={instance.secretStorageType === "external_vault"}>
                                                <span>Secrets in <strong>external Vault</strong></span>
                                            </Match>
                                            <Match when={instance.secretStorageType === "database"}>
                                                <span>Secrets in <strong>database</strong></span>
                                            </Match>
                                        </Switch>
                                    </div>
                                </div>
                                <Button variant="outline" size="small" onClick={(event) => onUninstall(instance.id, event)}>
                                    Uninstall
                                </Button>
                            </div>
                        )}
                    </For>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
