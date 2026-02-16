import type { JSX, ParentProps } from "solid-js";
import styles from "./Main.module.css";

export function Main(props: ParentProps & { class?: string }): JSX.Element {
    return <main class={`${styles.main} ${props.class ?? ""}`}>{props.children}</main>;
}
