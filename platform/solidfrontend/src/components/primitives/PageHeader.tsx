import { type JSX, Show } from "solid-js";
import styles from "./PageHeader.module.css";

interface Props {
    title: string;
    description?: string;
}

export function PageHeader(props: Props): JSX.Element {
    return (
        <header class={styles.header}>
            <h1 class={styles.title}>{props.title}</h1>
            <Show when={props.description}>
                <span class={styles.separator} aria-hidden="true">
                    •
                </span>
                <p class={styles.description}>{props.description}</p>
            </Show>
        </header>
    );
}
