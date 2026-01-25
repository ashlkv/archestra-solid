import type { JSX, ParentProps } from "solid-js";
import styles from "./MainLayout.module.css";

interface Props extends ParentProps {
    class?: string;
}

export function MainLayout(props: Props): JSX.Element {
    return (
        <main class={`${styles.main} ${props.class ?? ""}`}>
            {props.children}
        </main>
    );
}
