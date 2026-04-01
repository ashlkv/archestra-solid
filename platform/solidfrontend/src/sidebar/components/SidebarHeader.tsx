import type { JSX } from "solid-js";
import { ChevronLeft, ChevronRight } from "@/icons";
import styles from "./SidebarHeader.module.css";

export function SidebarHeader(props: { collapsed: boolean; onToggle: () => void }): JSX.Element {
    return (
        <div class={`${styles.header} ${props.collapsed ? styles.collapsed : ""}`}>
            <button
                type="button"
                class={styles["logo-button"]}
                onClick={props.onToggle}
                aria-label={props.collapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={props.collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                <img src="/logo.png" alt="Logo" class={styles.logo} />
            </button>
            <span class={styles.title}>Archestra.AI</span>
            <button
                type="button"
                class={styles.toggle}
                onClick={props.onToggle}
                aria-label={props.collapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={props.collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {props.collapsed ? <ChevronRight /> : <ChevronLeft />}
            </button>
        </div>
    );
}
