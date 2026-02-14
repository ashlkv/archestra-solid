import { For, type JSX, Show } from "solid-js";
import { Plus } from "@/components/icons";
import type { McpServer } from "@/types";
import { Button } from "../primitives/Button";
import { Dialog, DialogContent } from "../primitives/Dialog";
import { McpInstanceDetails } from "./McpInstanceDetails";
import styles from "./McpManageInstancesDialog.module.css";

type Props = {
    serverName: string;
    instances: McpServer[];
    onClose: () => void;
    onUninstall?: (serverId: string) => void;
    onInstall?: () => void;
};

export function McpManageInstancesDialog(props: Props): JSX.Element {
    return (
        <Dialog
            open
            onOpenChange={(open) => {
                if (!open) props.onClose();
            }}
        >
            <DialogContent title={`Manage instances: ${props.serverName}`} size="small">
                <div class={styles.container}>
                    <Show when={props.instances.length === 0}>
                        <p class={styles.empty}>No instances available.</p>
                    </Show>

                    <Show when={props.instances.length > 0}>
                        <div class={styles.instances}>
                            <For each={props.instances}>
                                {(instance) => (
                                    <div class={styles.instance}>
                                        <McpInstanceDetails instance={instance} />
                                        <Button variant="outline" onClick={() => props.onUninstall?.(instance.id)}>
                                            Uninstall
                                        </Button>
                                    </div>
                                )}
                            </For>
                        </div>
                    </Show>

                    <div class={styles.footer}>
                        <Button variant="default" onClick={() => props.onInstall?.()}>
                            <Plus size={14} />
                            Install new instance
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
