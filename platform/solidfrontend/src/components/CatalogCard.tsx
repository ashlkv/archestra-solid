import { createSignal, Show } from "solid-js";
import { CatalogCardModal } from "./CatalogCardModal";
import styles from "./CatalogCard.module.css";

interface Props {
    item: {
        id: string;
        name: string;
        serverType: string;
    };
}

export function CatalogCard(props: Props) {
    const [showModal, setShowModal] = createSignal(false);

    return (
        <>
            <li class={styles.item}>
                <span class={styles.info}>
                    <strong>{props.item.name}</strong>
                    <span class={styles.type}>({props.item.serverType})</span>
                </span>
                <button type="button" class={styles.editBtn} onClick={() => setShowModal(true)}>
                    Edit
                </button>
            </li>

            <Show when={showModal()}>
                <CatalogCardModal item={props.item} onClose={() => setShowModal(false)} />
            </Show>
        </>
    );
}
