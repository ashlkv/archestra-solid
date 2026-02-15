import { Dialog as KobalteDialog } from "@kobalte/core/dialog";
import { type JSX, type ParentProps, Show } from "solid-js";
import { X } from "@/components/icons";
import { PageHeader } from "~/components/primitives/PageHeader";
import styles from "./Drawer.module.css";

export function Drawer(props: ParentProps<{ open?: boolean; onOpenChange?: (open: boolean) => void }>): JSX.Element {
    return (
        <KobalteDialog open={props.open} onOpenChange={props.onOpenChange}>
            {props.children}
        </KobalteDialog>
    );
}

export function DrawerTrigger(props: ParentProps): JSX.Element {
    return (
        <KobalteDialog.Trigger as="div" class={styles.trigger}>
            {props.children}
        </KobalteDialog.Trigger>
    );
}

export function DrawerContent(
    props: ParentProps<{
        title?: string;
        description?: string;
        size?: "small" | "medium" | "large" | "xlarge" | "full";
        headerContent?: JSX.Element;
    }>,
): JSX.Element {
    const contentClass = () => {
        const classes = [styles.content];
        if (props.size === "small") classes.push(styles.small);
        else if (props.size === "large") classes.push(styles.large);
        else if (props.size === "xlarge") classes.push(styles.xlarge);
        else if (props.size === "full") classes.push(styles.full);
        else classes.push(styles.medium);
        return classes.join(" ");
    };

    return (
        <KobalteDialog.Portal>
            <KobalteDialog.Overlay class={styles.overlay} />
            <div class={styles.positioner}>
                <KobalteDialog.Content class={contentClass()}>
                    <div class={styles.header}>
                        <div class={styles.headerRow}>
                            <KobalteDialog.Title class={styles.title}>
                                <Show when={props.title}>
                                    <PageHeader title={props.title!} description={props.description} />
                                </Show>
                            </KobalteDialog.Title>
                            <KobalteDialog.CloseButton class={styles.close}>
                                <X size={16} />
                            </KobalteDialog.CloseButton>
                        </div>
                        <Show when={props.headerContent}>{props.headerContent}</Show>
                    </div>
                    <div class={styles.body}>{props.children}</div>
                </KobalteDialog.Content>
            </div>
        </KobalteDialog.Portal>
    );
}

export function DrawerFooter(props: ParentProps): JSX.Element {
    return <div class={styles.footer}>{props.children}</div>;
}
