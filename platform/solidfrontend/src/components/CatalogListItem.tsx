import { createSignal, Show } from "solid-js";
import { EditCatalogModal } from "./EditCatalogModal";
import { QueryProvider } from "./QueryProvider";

interface Props {
    item: {
        id: string;
        name: string;
        serverType: string;
    };
}

export function CatalogListItem(props: Props) {
    const [showModal, setShowModal] = createSignal(false);

    return (
        <QueryProvider>
            <li>
                <span class="server-info">
                    <strong>{props.item.name}</strong>
                    <span class="type">({props.item.serverType})</span>
                </span>
                <button
                    type="button"
                    class="edit-btn"
                    onClick={() => setShowModal(true)}
                >
                    Edit
                </button>
            </li>

            <Show when={showModal()}>
                <EditCatalogModal
                    item={props.item}
                    onClose={() => setShowModal(false)}
                />
            </Show>
        </QueryProvider>
    );
}
