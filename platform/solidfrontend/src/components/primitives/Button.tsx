import { Button as KobalteButton } from "@kobalte/core/button";
import type { ComponentProps, JSX, ParentProps } from "solid-js";
import { splitProps } from "solid-js";
import styles from "./Button.module.css";

type Props = ParentProps<{
    type?: "button" | "submit" | "reset";
    variant?: "default" | "ghost";
    size?: "default" | "small" | "icon";
    disabled?: boolean;
    onClick?: (e: MouseEvent) => void;
    class?: string;
}> & Omit<ComponentProps<"button">, "type" | "disabled" | "onClick" | "class">;

const sizeClasses: Record<string, string> = {
    small: styles.small,
    icon: styles.icon,
};

export function Button(props: Props): JSX.Element {
    const [local, rest] = splitProps(props, ["type", "variant", "size", "disabled", "onClick", "class", "children"]);
    const variantClass = () => (local.variant === "ghost" ? styles.ghost : "");
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
