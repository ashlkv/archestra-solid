import type { JSX, ParentProps } from "solid-js";
import { Sidebar } from "~/components/sidebar/Sidebar";
import styles from "./FixedLayout.module.css";

interface Props extends ParentProps {
    class?: string;
}

export function FixedLayout(props: Props): JSX.Element {
    return (
        <div class={styles.layout}>
            <Sidebar />
            <main class={`${styles.main} ${props.class ?? ""}`}>{props.children}</main>
        </div>
    );
}
