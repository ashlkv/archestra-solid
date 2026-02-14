import type { JSX } from "solid-js";
import styles from "./SidebarHeader.module.css";

export function SidebarHeader(): JSX.Element {
    return (
        <div class={styles.header}>
            <img src="/logo.png" alt="Logo" class={styles.logo} />
            <span class={styles.title}>Archestra.AI</span>
        </div>
    );
}
