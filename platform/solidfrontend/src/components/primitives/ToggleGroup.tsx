import type { ComponentProps, JSX, ParentProps } from "solid-js";
import { Show, splitProps } from "solid-js";
import { Button, IconSize, TextButtonSize } from "./Button";
import { Spinner } from "./Spinner";
import styles from "./ToggleGroup.module.css";
import { clsx } from 'clsx';

export function ToggleGroup(props: ParentProps<{ size?: TextButtonSize }>): JSX.Element {
    const sizeClass = () => {
        if (props.size === "medium") return styles.medium;
        if (props.size === "small") return styles.small;
        return "";
    };

    return <div class={`${styles.container} ${sizeClass()}`}>{props.children}</div>;
}

type ToggleItemProps = {
    selected: boolean;
    loading?: boolean;
    tooltip: string;
    label?: string;
    children: JSX.Element;
    size: TextButtonSize & IconSize;
} & Omit<ComponentProps<typeof Button>, "variant" | "size" | "class" | "children">;

export function ToggleButton(props: ToggleItemProps): JSX.Element {
    const [local, rest] = splitProps(props, ["selected", "loading", "tooltip", "label", "children"]);
    const hasLabel = () => !!local.label;

    return (
        <Button
            variant="ghost"
            class={clsx(styles.button, hasLabel() ? '' : styles.icon)}
            tooltip={local.tooltip}
            data-selected={local.selected || undefined}
            {...rest}
        >
            <Show when={local.loading} fallback={local.children}>
                <Spinner size={14} />
            </Show>
            <Show when={local.label}>
                <span>{local.label}</span>
            </Show>
        </Button>
    );
}
