/**
 * Non-scrollable container for use inside VerticalSplit / HorizontalSplit.
 * A single div that fills its grid cell and clips overflow.
 */
import type { JSX, ParentProps } from "solid-js";
import { splitProps } from "solid-js";
import styles from "./Column.module.css";

export function Column(
    props: ParentProps<{ class?: string } & JSX.HTMLAttributes<HTMLDivElement>>,
): JSX.Element {
    const [local, rest] = splitProps(props, ["class", "children"]);
    return (
        <div class={`${styles.column} ${local.class ?? ""}`} {...rest}>
            {local.children}
        </div>
    );
}
