import type { JSX, ParentProps } from "solid-js";
import styles from "./Grid.module.css";

interface Props extends ParentProps {
    columns?: 1 | 2;
    class?: string;
}

export function Grid(props: Props): JSX.Element {
    const columns = () => props.columns ?? 2;

    return (
        <div
            class={`${styles.grid} ${columns() === 2 ? styles.cols2 : ""} ${props.class ?? ""}`}
        >
            {props.children}
        </div>
    );
}
