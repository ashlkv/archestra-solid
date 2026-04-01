/**
 * Content-driven shell: sidebar + main area, where the page grows with content.
 * The body scrollbar handles scrolling; the sidebar stays in place via sticky positioning.
 *
 * Compare with FixedLayout, which locks everything to viewport height
 * so child columns can scroll independently.
 */
import type { JSX, ParentProps } from "solid-js";
import { Sidebar } from "~/sidebar/components/Sidebar";
import styles from "./StaticLayout.module.css";

interface Props extends ParentProps {
    class?: string;
}

export function StaticLayout(props: Props): JSX.Element {
    return (
        <div class={styles["layout"]}>
            <Sidebar class={styles["sidebar"]} />
            <div class={styles["content"]}>{props.children}</div>
        </div>
    );
}
