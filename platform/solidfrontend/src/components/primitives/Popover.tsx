import { Popover as KobaltePopover } from "@kobalte/core/popover";
import type { JSX, ParentProps } from "solid-js";
import styles from "./Popover.module.css";

export function Popover(props: ParentProps<{ open?: boolean; onOpenChange?: (open: boolean) => void }>): JSX.Element {
    return (
        <KobaltePopover open={props.open} onOpenChange={props.onOpenChange}>
            {props.children}
        </KobaltePopover>
    );
}

export function PopoverTrigger(props: ParentProps): JSX.Element {
    return (
        <KobaltePopover.Trigger as="div" class={styles.trigger}>
            {props.children}
        </KobaltePopover.Trigger>
    );
}

export function PopoverContent(props: ParentProps): JSX.Element {
    return (
        <KobaltePopover.Portal>
            <KobaltePopover.Content class={styles.content}>
                <KobaltePopover.Arrow class={styles.arrow} />
                {props.children}
            </KobaltePopover.Content>
        </KobaltePopover.Portal>
    );
}
