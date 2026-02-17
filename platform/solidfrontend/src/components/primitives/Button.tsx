import { Button as KobalteButton } from "@kobalte/core/button";
import type { ComponentProps, JSX, ParentProps } from "solid-js";
import { Show, splitProps } from "solid-js";
import styles from "./Button.module.css";
import { Tooltip } from "./Tooltip";

type Variant = "default" | "ghost" | "outline" | "info" | "success" | "warning" | "destructive";

export type IconSize = "icon" | "icon-medium" | "icon-small";
export type TextButtonSize = "inherit" | "medium" | "large" | "small" | "xsmall";

type BaseProps = ParentProps<{
    type?: "button" | "submit" | "reset";
    variant?: Variant;
    disabled?: boolean;
    onClick?: (e: MouseEvent) => void;
    class?: string;
}> & Omit<ComponentProps<"button">, "type" | "disabled" | "onClick" | "class">;

type IconProps = BaseProps & { size: IconSize; tooltip: string };
type NonIconProps = BaseProps & { size?: TextButtonSize; tooltip?: string };

type Props = IconProps | NonIconProps;

const sizeClasses: Record<string, string> = {
    large: styles.large,
    medium: styles.medium,
    small: styles.small,
    xsmall: styles.xsmall,
    icon: styles.icon,
    ["icon-medium"]: styles["icon-medium"],
    ["icon-small"]: styles["icon-small"],
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
    const [local, rest] = splitProps(props, ["type", "variant", "size", "disabled", "onClick", "class", "children", "tooltip"]);
    const variantClass = () => (local.variant ? (variantClasses[local.variant] ?? "") : "");
    const sizeClass = () => (local.size ? (sizeClasses[local.size] ?? "") : "");

    const button = (
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

    return (
        <>
            <Show when={local.tooltip}>
                <Tooltip content={local.tooltip!}>{button}</Tooltip>
            </Show>
            <Show when={!local.tooltip}>
                {button}
            </Show>
        </>
    );
}
