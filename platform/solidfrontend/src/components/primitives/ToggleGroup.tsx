import type { ComponentProps, JSX, ParentProps } from "solid-js";
import { Show, splitProps } from "solid-js";
import { Button } from "./Button";
import { Spinner } from "./Spinner";
import { Tooltip } from "./Tooltip";
import styles from "./ToggleGroup.module.css";

export function ToggleGroup(props: ParentProps): JSX.Element {
    return <div class={styles.container}>{props.children}</div>;
}

type ToggleItemProps = {
    selected: boolean;
    loading?: boolean;
    tooltip: string;
    children: JSX.Element;
} & Omit<ComponentProps<typeof Button>, "variant" | "size" | "class" | "children">;

export function ToggleItem(props: ToggleItemProps): JSX.Element {
    const [local, rest] = splitProps(props, ["selected", "loading", "tooltip", "children"]);

    return (
        <Tooltip content={local.tooltip}>
            <Button
                variant="ghost"
                size="icon"
                class={styles.button}
                data-selected={local.selected || undefined}
                {...rest}
            >
                <Show when={local.loading} fallback={local.children}>
                    <Spinner size={14} />
                </Show>
            </Button>
        </Tooltip>
    );
}
