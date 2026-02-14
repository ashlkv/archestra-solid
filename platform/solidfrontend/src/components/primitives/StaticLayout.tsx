import type { JSX, ParentProps } from "solid-js";
import { Sidebar } from "~/components/sidebar/Sidebar";
import styles from "./StaticLayout.module.css";

interface Props extends ParentProps {
    class?: string;
}

export function StaticLayout(props: Props): JSX.Element {
    return (
        <div class={styles["layout"]}>
            <Sidebar class={styles["sidebar"]} />
            <main class={`${styles.main} ${props.class ?? ""}`}>
                {props.children}
            </main>
        </div>
    );
}
