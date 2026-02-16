import type { JSX, ParentProps } from "solid-js";
import { Trash2 } from "@/components/icons";
import styles from "./PolicyCard.module.css";

export function PolicyCard(props: ParentProps<{ onDelete: () => void }>): JSX.Element {
    return (
        <div class={styles.card} data-label="Policy card">
            <div class={styles.content}>{props.children}</div>
            <div class={styles.actions}>
                <button type="button" class={styles.delete} onClick={props.onDelete} aria-label="Delete policy">
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}
