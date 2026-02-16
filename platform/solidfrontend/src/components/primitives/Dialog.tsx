import { Dialog as KobalteDialog } from "@kobalte/core/dialog";
import type { JSX, ParentProps } from "solid-js";
import { X } from "@/components/icons";
import styles from "./Dialog.module.css";

export function Dialog(props: ParentProps<{ open?: boolean; onOpenChange?: (open: boolean) => void }>): JSX.Element {
    return (
        <KobalteDialog open={props.open} onOpenChange={props.onOpenChange}>
            {props.children}
        </KobalteDialog>
    );
}

export function DialogTrigger(props: ParentProps): JSX.Element {
    return (
        <KobalteDialog.Trigger as="div" class={styles.trigger}>
            {props.children}
        </KobalteDialog.Trigger>
    );
}

export function DialogContent(
    props: ParentProps<{ title?: string; size?: "small" | "medium" | "large" }>,
): JSX.Element {
    const contentClass = () => {
        const classes = [styles.content];
        if (props.size === "small") {
            classes.push(styles.small);
        } else if (props.size === "large") {
            classes.push(styles.large);
        } else {
            classes.push(styles.medium);
        }
        return classes.join(" ");
    };

    return (
        <KobalteDialog.Portal>
            <KobalteDialog.Overlay class={styles.overlay} />
            <div class={styles.positioner}>
                <KobalteDialog.Content class={contentClass()}>
                    <div class={styles.header}>
                        <KobalteDialog.Title class={styles.title}>{props.title}</KobalteDialog.Title>
                        <KobalteDialog.CloseButton class={styles.close}>
                            <X size={16} />
                        </KobalteDialog.CloseButton>
                    </div>
                    <div class={styles.body}>{props.children}</div>
                </KobalteDialog.Content>
            </div>
        </KobalteDialog.Portal>
    );
}
