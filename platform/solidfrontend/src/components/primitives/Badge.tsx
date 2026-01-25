import type { ComponentProps, JSX, ParentProps } from "solid-js";
import { splitProps } from "solid-js";
import styles from "./Badge.module.css";

type Props = ParentProps<{
    variant?: "primary" | "muted";
    class?: string;
}> & Omit<ComponentProps<"span">, "class">;

export function Badge(props: Props): JSX.Element {
    const [local, rest] = splitProps(props, ["variant", "class", "children"]);
    const variantClass = () => (local.variant === "muted" ? styles.muted : "");

    return (
        <span class={`${styles.badge} ${variantClass()} ${local.class ?? ""}`} {...rest}>
            {local.children}
        </span>
    );
}
