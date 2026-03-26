import type { JSX, ParentProps } from "solid-js";
import { splitProps } from "solid-js";
import styles from "./Panel.module.css";

export function Panel(
    props: ParentProps<{ class?: string; fullHeight?: boolean } & JSX.HTMLAttributes<HTMLDivElement>>,
): JSX.Element {
    const [local, rest] = splitProps(props, ["class", "children", "fullHeight"]);

    return (
        <div class={`${styles.panel} ${local.fullHeight ? styles["full-height"] : ""} ${local.class ?? ""}`} {...rest}>
            {local.children}
        </div>
    );
}
