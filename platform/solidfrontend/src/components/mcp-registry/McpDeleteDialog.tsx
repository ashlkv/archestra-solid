import { Show } from "solid-js";
import type { MCP } from "@/types";
import { Button } from "../primitives/Button";
import { Dialog, DialogContent } from "../primitives/Dialog";
import styles from "./McpDeleteDialog.module.css";

type Props = {
    item: MCP | undefined;
    installationCount: number;
    deleting: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export function McpDeleteDialog(props: Props) {
    return (
        <Dialog
            open
            onOpenChange={(open) => {
                if (!open) props.onClose();
            }}
        >
            <DialogContent title="Delete catalog item">
                <div class={styles.content}>
                    <p class={styles.message}>
                        Are you sure you want to delete <strong>"{props.item?.name}"</strong>?
                    </p>
                    <Show when={props.installationCount > 0}>
                        <p class={styles.warning}>
                            There are currently <strong>{props.installationCount}</strong> installation(s) of this
                            server. Deleting this catalog entry will also uninstall all associated servers.
                        </p>
                    </Show>
                    <div class={styles.footer}>
                        <Button variant="outline" onClick={props.onClose} disabled={props.deleting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={props.onConfirm} disabled={props.deleting}>
                            {props.deleting ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
