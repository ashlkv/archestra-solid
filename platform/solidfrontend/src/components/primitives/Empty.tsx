import type { JSX, ParentProps } from "solid-js";
import styles from "./Empty.module.css";

interface Props extends ParentProps {
    class?: string;
}

export function Empty(props: Props): JSX.Element {
    return (
        <div class={`${styles.empty} ${props.class ?? ""}`}>
            {props.children}
        </div>
    );
}

export function EmptyMedia(props: ParentProps): JSX.Element {
    return <div class={styles.media}>{props.children}</div>;
}

export function EmptyTitle(props: ParentProps): JSX.Element {
    return <h3 class={styles.title}>{props.children}</h3>;
}

export function EmptyDescription(props: ParentProps): JSX.Element {
    return <p class={styles.description}>{props.children}</p>;
}

export function EmptyContent(props: ParentProps): JSX.Element {
    return <div class={styles.content}>{props.children}</div>;
}
