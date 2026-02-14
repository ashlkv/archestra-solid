import { splitProps, type JSX, type ParentProps } from "solid-js";
import styles from "./Empty.module.css";

type Props = ParentProps<JSX.HTMLAttributes<HTMLDivElement>>;

export function Empty(props: Props): JSX.Element {
    const [local, rest] = splitProps(props, ["class", "children"]);
    return (
        <div class={`${styles.empty} ${local.class ?? ""}`} {...rest}>
            {local.children}
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
