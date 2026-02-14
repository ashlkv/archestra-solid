import { Dynamic, For, Show } from "solid-js/web";
import type { MCP, McpServer } from "@/types";
import { getIcon, isWellKnownIcon } from "../mcp-icons/icon-registry";
import { Badge } from "../primitives/Badge";
import { Button } from "../primitives/Button";
import { McpCardMenu } from "./McpCardMenu";
import { McpInstanceHoverCard } from "./McpInstanceHoverCard";
import styles from "./McpCard.module.css";

type Props = {
    item: MCP;
    instances?: McpServer[];
    onInstall?: () => void;
    onUninstall?: (serverId: string) => void;
    onManageInstallations?: () => void;
    onLogs?: () => void;
    onRestart?: () => void;
    onAbout?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
};

function getCredentialLabel(instance: McpServer): string {
    if (instance.userDetails?.[0]?.email) {
        return instance.userDetails[0].email;
    }
    if (instance.teamDetails?.name) {
        return instance.teamDetails.name;
    }
    return instance.ownerEmail ?? "Unknown";
}

const badgeColors: Record<MCP["serverType"], "info" | "muted" | "success">  = {
    remote: 'info',
    local: 'success',
    builtin: 'success',
}

export function McpCard(props: Props) {
    const isLocal = () => props.item.serverType === "local";
    const isBuiltin = () => props.item.serverType === "builtin";
    const isWellKnown = () => isWellKnownIcon(props.item.name);
    const instanceCount = () => props.instances?.length ?? 0;
    const isInstalled = () => instanceCount() > 0;
    const hasMultipleInstances = () => instanceCount() > 1;

    const badges = () => {
        const result: Array<{ label: string; variant: "info" | "muted" | "success" }> = [];
        if (props.item.serverType) {
            result.push({
                label: isBuiltin() ? "local" : props.item.serverType,
                variant: isBuiltin() ? badgeColors.local : badgeColors[props.item.serverType] ?? "muted",
            });
        }
        if (isBuiltin()) {
            result.push({ label: "native", variant: "muted" });
        } else {
            const transport = props.item.localConfig?.transportType ?? "stdio";
            if (isLocal()) {
                result.push({ label: transport, variant: "muted" });
            } else {
                result.push({ label: "http", variant: "muted" });
            }
        }
        return result;
    };

    const onInstall = (event: MouseEvent) => {
        event.stopPropagation();
        props.onInstall?.();
    };

    const cardClass = () => {
        const classes = [styles.card];
        if (isBuiltin()) {
            classes.push(styles.builtin);
        }
        if (isWellKnown()) {
            classes.push(styles["well-known"]);
        }
        return classes.join(' ');
    }

    return (
        <div class={cardClass()} data-label="Card">
            <div class={styles.main} data-label="Card main">
                <div class={styles["top-row"]}>
                    <div class={styles.icon} data-label="Icon">
                        <Dynamic component={getIcon(props.item.name)} size={24} />
                    </div>
                    <div class={styles.header}>
                        <p class={styles.name} data-label="Name">{props.item.name}</p>
                        <div class={styles.badges} data-label="Badges">
                            <For each={badges()}>
                                {(badge) => (
                                    <Badge variant={badge.variant} pill caps>
                                        {badge.label}
                                    </Badge>
                                )}
                            </For>
                        </div>
                    </div>
                </div>
                <Show when={props.item.description}>
                    <p class={styles.description} data-label="Description">{props.item.description}</p>
                </Show>
            </div>
            <div class={styles.actions} data-label="Actions">
                <Show when={isBuiltin()}>
                    <div class={styles["system-info"]} data-label="Built-in info">
                        <p>Built-in server, always available. Cannot be installed or deleted.</p>
                    </div>
                </Show>
                <Show when={!isBuiltin()}>
                    <McpCardMenu
                        isLocal={isLocal()}
                        isInstalled={isInstalled()}
                        onLogs={props.onLogs}
                        onRestart={props.onRestart}
                        onManageInstallations={props.onManageInstallations}
                        onAbout={props.onAbout}
                        onEdit={props.onEdit}
                        onDelete={props.onDelete}
                        class={styles["context-menu"]}
                    />
                </Show>
                <Show when={isInstalled() && !isBuiltin()}>
                    <McpInstanceHoverCard instances={props.instances ?? []} onUninstall={props.onUninstall}>
                        <div class={styles["installed-info"]} data-label="Installed info">
                            <Show when={hasMultipleInstances()}>
                                <p class={styles["installed-label"]}>Installed × {instanceCount()}</p>
                                <p class={styles["installed-credential"]}>various credentials</p>
                            </Show>
                            <Show when={!hasMultipleInstances()}>
                                <p class={styles["installed-label"]}>Installed with</p>
                                <p class={styles["installed-credential"]}>
                                    {getCredentialLabel(props.instances![0])}
                                </p>
                            </Show>
                        </div>
                    </McpInstanceHoverCard>
                    <Button variant="default" size="small" onClick={onInstall} data-label="New instance">
                        New instance
                    </Button>
                </Show>
                <Show when={!isInstalled() && !isBuiltin()}>
                    <Button onClick={onInstall} class={styles["install-button"]} data-label="Install">
                        Install
                    </Button>
                </Show>
            </div>
        </div>
    );
}
