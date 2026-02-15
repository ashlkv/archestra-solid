import type { ComponentProps, JSX, ParentProps } from "solid-js";
import { splitProps } from "solid-js";
import styles from "./Badge.module.css";

type Variant = "default" | "ghost" | "outline" | "muted" | "primary" | "secondary" | "accent" | "info" | "success" | "warning" | "destructive";

type Props = ParentProps<{
    variant?: Variant;
    caps?: boolean;
    pill?: boolean;
    class?: string;
}> & Omit<ComponentProps<"span">, "class">;

const variantClasses: Record<string, string> = {
    ghost: styles.ghost,
    outline: styles.outline,
    muted: styles.muted,
    primary: styles.primary,
    secondary: styles.secondary,
    accent: styles.accent,
    success: styles.success,
    warning: styles.warning,
    destructive: styles.destructive,
};

export function Badge(props: Props): JSX.Element {
    const [local, rest] = splitProps(props, ["variant", "caps", "pill", "class", "children"]);
    const variantClass = () => (local.variant ? variantClasses[local.variant] ?? "" : "");
    const capsClass = () => (local.caps ? styles.caps : "");
    const pillClass = () => (local.pill ? styles.pill : "");

    return (
        <span data-label="Badge" class={`${styles.badge} ${variantClass()} ${capsClass()} ${pillClass()} ${local.class ?? ""}`} {...rest}>
            {local.children}
        </span>
    );
}
