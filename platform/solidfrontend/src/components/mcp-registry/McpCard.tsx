import { createSignal, Show } from "solid-js";
import { McpModal } from "./McpModal";
import styles from "./McpCard.module.css";
import { type MCP } from "@/types";

interface Props {
    item: MCP;
}

export function McpCard(props: Props) {
    const [isModalShown, setIsModalShown] = createSignal(false);

    return (
        <>
            <div class={styles.card} onClick={() => setIsModalShown(true)}>
                <div class={styles.iconPlaceholder} />
                <div class={styles.content}>
                    <p class={styles.name}>{props.item.name}</p>
                    <Show when={props.item.description}>
                        <p class={styles.description}>{props.item.description}</p>
                    </Show>
                </div>
            </div>

            <Show when={isModalShown()}>
                <McpModal item={props.item} onClose={() => setIsModalShown(false)} />
            </Show>
        </>
    );
}
