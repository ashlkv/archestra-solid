import { Loader2 } from "lucide-solid";
import type { JSX } from "solid-js";
import styles from "./Spinner.module.css";

export function Spinner(props: { size?: number }): JSX.Element {
    return <Loader2 size={props.size ?? 16} class={styles.spinner} />;
}
