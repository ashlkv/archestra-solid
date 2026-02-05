import { X } from "@/components/icons";
import type { ComponentProps, JSX, ParentProps } from "solid-js";
import { splitProps } from "solid-js";
import styles from "./Tag.module.css";

type Props = ParentProps<{
    size?: "small" | "regular";
    variant?: "primary" | "muted";
    onDelete?: () => void;
}> & Omit<ComponentProps<"span">, "class">;

const sizeClasses: Record<string, string> = {
    small: styles.small,
    regular: styles.regular,
};

export function Tag(props: Props): JSX.Element {
    const [local, rest] = splitProps(props, ["size", "variant", "onDelete", "children"]);
    const sizeClass = () => sizeClasses[local.size ?? "small"] ?? "";
    const variantClass = () => (local.variant === "muted" ? styles.muted : "");

    return (
        <span class={`${styles.tag} ${sizeClass()} ${variantClass()}`} {...rest}>
            {local.children}
            <button type="button" class={styles.delete} onClick={local.onDelete}>
                <X size={local.size === "regular" ? 14 : 12} />
            </button>
        </span>
    );
}
