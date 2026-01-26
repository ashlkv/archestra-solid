import { Dialog as KobalteDialog } from "@kobalte/core/dialog";
import { X } from "lucide-solid";
import type { JSX, ParentProps } from "solid-js";
import styles from "./Dialog.module.css";

export function Dialog(props: ParentProps<{ open?: boolean; onOpenChange?: (open: boolean) => void }>): JSX.Element {
    return (
        <KobalteDialog open={props.open} onOpenChange={props.onOpenChange}>
            {props.children}
        </KobalteDialog>
    );
}

export function DialogTrigger(props: ParentProps): JSX.Element {
    return <KobalteDialog.Trigger as="div" class={styles.trigger}>{props.children}</KobalteDialog.Trigger>;
}

export function DialogContent(props: ParentProps<{ title?: string }>): JSX.Element {
    return (
        <KobalteDialog.Portal>
            <KobalteDialog.Overlay class={styles.overlay} />
            <div class={styles.positioner}>
                <KobalteDialog.Content class={styles.content}>
                    <div class={styles.header}>
                        <KobalteDialog.Title class={styles.title}>{props.title}</KobalteDialog.Title>
                        <KobalteDialog.CloseButton class={styles.close}>
                            <X size={16} />
                        </KobalteDialog.CloseButton>
                    </div>
                    <div class={styles.body}>
                        {props.children}
                    </div>
                </KobalteDialog.Content>
            </div>
        </KobalteDialog.Portal>
    );
}
