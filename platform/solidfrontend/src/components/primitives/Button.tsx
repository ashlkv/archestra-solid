import { Button as KobalteButton } from "@kobalte/core/button";
import type { ComponentProps, JSX, ParentProps } from "solid-js";
import { splitProps } from "solid-js";
import styles from "./Button.module.css";

type Variant = "default" | "ghost" | "outline" | "info" | "success" | "warning" | "destructive";

type Props = ParentProps<{
    type?: "button" | "submit" | "reset";
    variant?: Variant;
    size?: "default" | "small" | "xsmall" | "icon";
    disabled?: boolean;
    onClick?: (e: MouseEvent) => void;
    class?: string;
}> & Omit<ComponentProps<"button">, "type" | "disabled" | "onClick" | "class">;

const sizeClasses: Record<string, string> = {
    small: styles.small,
    xsmall: styles.xsmall,
    icon: styles.icon,
};

const variantClasses: Record<string, string> = {
    ghost: styles.ghost,
    outline: styles.outline,
    info: styles.info,
    success: styles.success,
    warning: styles.warning,
    destructive: styles.destructive,
};

export function Button(props: Props): JSX.Element {
    const [local, rest] = splitProps(props, ["type", "variant", "size", "disabled", "onClick", "class", "children"]);
    const variantClass = () => (local.variant ? variantClasses[local.variant] ?? "" : "");
    const sizeClass = () => (local.size ? sizeClasses[local.size] ?? "" : "");

    return (
        <KobalteButton
            type={local.type ?? "button"}
            disabled={local.disabled}
            onClick={local.onClick}
            class={`${styles.button} ${variantClass()} ${sizeClass()} ${local.class ?? ""}`}
            {...rest}
        >
            {local.children}
        </KobalteButton>
    );
}
