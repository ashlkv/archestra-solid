import { Alert as KobalteAlert } from "@kobalte/core/alert";
import { type JSX, type ParentProps, Show } from "solid-js";
import styles from "./Alert.module.css";

interface Props extends ParentProps {
    title?: string;
    variant?: "default" | "destructive";
    class?: string;
}

export function Alert(props: Props): JSX.Element {
    const variantClass = () => (props.variant === "destructive" ? styles.destructive : "");

    return (
        <KobalteAlert class={`${styles.alert} ${variantClass()} ${props.class ?? ""}`}>
            <div>
                <Show when={props.title}>
                    <p class={styles.title}>{props.title}</p>
                </Show>
                <Show when={props.children}>
                    <p class={styles.description}>{props.children}</p>
                </Show>
            </div>
        </KobalteAlert>
    );
}
