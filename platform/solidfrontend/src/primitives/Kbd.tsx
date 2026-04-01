import type { JSX, ParentProps } from "solid-js";
import styles from "./Kbd.module.css";

export function Kbd(props: ParentProps<{ class?: string }>): JSX.Element {
    return <kbd class={`${styles.kbd} ${props.class ?? ""}`}>{props.children}</kbd>;
}
