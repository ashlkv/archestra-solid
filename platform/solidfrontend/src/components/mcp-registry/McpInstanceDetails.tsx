import { Match, Switch } from "solid-js";
import { Key } from "@/components/icons";
import type { McpServer } from "@/types";
import styles from "./McpInstanceDetails.module.css";

type Props = {
    instance: McpServer;
};

export function McpInstanceDetails(props: Props) {
    return (
        <div class={styles.details}>
            <p class={styles.email}>{getInstanceLabel(props.instance)}</p>
            <p class={styles.meta}>Installed: {formatDate(props.instance.createdAt)}</p>
            {/* Secret storage type indicates where secrets are stored/managed:
                - "none": Secrets weren't provided during installation (optional)
                - "database": Secrets stored in Archestra database
                - "vault": Secrets stored in Archestra-managed HashiCorp Vault
                - "external_vault": Secrets stored in customer's external Vault (BYOS)
                For local servers, secrets are always injected as K8s Secrets. */}
            <div class={styles.storage}>
                <Key size={14} class={styles["storage-icon"]} />
                <Switch fallback={<span>No secrets configured</span>}>
                    <Match when={props.instance.secretStorageType === "vault"}>
                        <span>
                            Secrets in <strong>Vault</strong>
                        </span>
                    </Match>
                    <Match when={props.instance.secretStorageType === "external_vault"}>
                        <span>
                            Secrets in <strong>external Vault</strong>
                        </span>
                    </Match>
                    <Match when={props.instance.secretStorageType === "database"}>
                        <span>
                            Secrets in <strong>database</strong>
                        </span>
                    </Match>
                </Switch>
            </div>
        </div>
    );
}

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
