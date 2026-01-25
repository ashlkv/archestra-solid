import { createSignal, Show } from "solid-js";
import { CatalogCardModal } from "./CatalogCardModal";
import styles from "./CatalogCard.module.css";
import { type MCP } from '@/types';

interface Props {
    item: MCP;
}

export function CatalogCard(props: Props) {
    const [isModalShown, setIsModalShown] = createSignal(false);

    return (
        <>
            <li class={styles.item}>
                <span class={styles.info}>
                    <strong>{props.item.name}</strong>
                    <span class={styles.type}>({props.item.serverType})</span>
                </span>
                <button type="button" class={styles.editBtn} onClick={() => setIsModalShown(true)}>
                    Edit
                </button>
            </li>

            <Show when={isModalShown()}>
                <CatalogCardModal item={props.item} onClose={() => setIsModalShown(false)} />
            </Show>
        </>
    );
}
