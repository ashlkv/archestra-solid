import type { JSX, ParentProps } from "solid-js";
import { splitProps } from "solid-js";
import styles from "./DropdownPanel.module.css";

type PanelProps = ParentProps<{ class?: string } & JSX.HTMLAttributes<HTMLDivElement>>;

export function DropdownPanel(props: PanelProps): JSX.Element {
    const [local, rest] = splitProps(props, ["class", "children"]);

    return (
        <div class={`${styles.panel} ${local.class ?? ""}`} {...rest}>
            {local.children}
        </div>
    );
}

export function DropdownPanelItem(
    props: ParentProps<{ selected?: boolean; class?: string } & JSX.HTMLAttributes<HTMLDivElement>>,
): JSX.Element {
    const [local, rest] = splitProps(props, ["selected", "class", "children"]);

    return (
        <div class={`${styles.item} ${local.selected ? styles.selected : ""} ${local.class ?? ""}`} {...rest}>
            {local.children}
        </div>
    );
}

export function DropdownPanelEmpty(props: PanelProps): JSX.Element {
    const [local, rest] = splitProps(props, ["class", "children"]);

    return (
        <div class={`${styles.empty} ${local.class ?? ""}`} {...rest}>
            {local.children}
        </div>
    );
}
