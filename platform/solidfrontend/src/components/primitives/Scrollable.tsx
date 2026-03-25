/**
 * Independently scrollable container for use inside VerticalSplit / HorizontalSplit.
 * A single div that fills its grid cell and scrolls its own content.
 */
import type { JSX, ParentProps } from "solid-js";
import { splitProps } from "solid-js";
import styles from "./Scrollable.module.css";

export function Scrollable(
    props: ParentProps<{ class?: string } & JSX.HTMLAttributes<HTMLDivElement>>,
): JSX.Element {
    const [local, rest] = splitProps(props, ["class", "children"]);
    return (
        <div class={`${styles.scrollable} ${local.class ?? ""}`} {...rest}>
            {local.children}
        </div>
    );
}
