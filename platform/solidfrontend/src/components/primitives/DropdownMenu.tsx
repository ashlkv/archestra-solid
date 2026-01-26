import { DropdownMenu as KobalteDropdownMenu } from "@kobalte/core/dropdown-menu";
import type { JSX, ParentProps } from "solid-js";
import { splitProps } from "solid-js";
import styles from "./DropdownMenu.module.css";

export function DropdownMenu(props: ParentProps) {
    return <KobalteDropdownMenu gutter={4}>{props.children}</KobalteDropdownMenu>;
}

export function DropdownMenuTrigger(props: ParentProps<{ class?: string }>) {
    return (
        <KobalteDropdownMenu.Trigger class={`${styles.trigger} ${props.class ?? ""}`}>
            {props.children}
        </KobalteDropdownMenu.Trigger>
    );
}

export function DropdownMenuContent(props: ParentProps) {
    return (
        <KobalteDropdownMenu.Portal>
            <KobalteDropdownMenu.Content class={styles.content}>
                {props.children}
            </KobalteDropdownMenu.Content>
        </KobalteDropdownMenu.Portal>
    );
}

type ItemProps = ParentProps<{
    onClick?: () => void;
    disabled?: boolean;
    variant?: "default" | "destructive";
}>;

export function DropdownMenuItem(props: ItemProps): JSX.Element {
    const [local, rest] = splitProps(props, ["onClick", "disabled", "variant", "children"]);
    const variantClass = () => (local.variant === "destructive" ? styles.destructive : "");

    return (
        <KobalteDropdownMenu.Item
            class={`${styles.item} ${variantClass()}`}
            onSelect={local.onClick}
            disabled={local.disabled}
            {...rest}
        >
            {local.children}
        </KobalteDropdownMenu.Item>
    );
}

export function DropdownMenuSeparator() {
    return <KobalteDropdownMenu.Separator class={styles.separator} />;
}
