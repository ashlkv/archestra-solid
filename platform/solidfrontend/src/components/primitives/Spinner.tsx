import type { JSX } from "solid-js";
import { Loader2 } from "@/components/icons";
import styles from "./Spinner.module.css";

export function Spinner(props: { size?: number }): JSX.Element {
    return <Loader2 size={props.size ?? 16} class={styles.spinner} />;
}
