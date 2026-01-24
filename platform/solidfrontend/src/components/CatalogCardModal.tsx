import { createSignal } from "solid-js";
import { useUpdateInternalMcpCatalogItem } from "@/lib/internal-mcp-catalog.query";
import styles from "./CatalogCardModal.module.css";

interface Props {
    item: {
        id: string;
        name: string;
    };
    onClose: () => void;
}

export function CatalogCardModal(props: Props) {
    const [name, setName] = createSignal(props.item.name);
    const [error, setError] = createSignal("");

    const updateMutation = useUpdateInternalMcpCatalogItem();

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setError("");

        try {
            await updateMutation.mutateAsync({
                id: props.item.id,
                data: { name: name() },
            });

            props.onClose();
        } catch (err) {
            setError("Failed to update catalog item");
        }
    };

    return (
        <div class={styles.backdrop} onClick={() => props.onClose()}>
            <div class={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2>Edit Catalog Item</h2>

                <form onSubmit={handleSubmit}>
                    <label>
                        Name
                        <input type="text" value={name()} onInput={(e) => setName(e.currentTarget.value)} required />
                    </label>

                    {error() && <p class={styles.error}>{error()}</p>}

                    <div class={styles.actions}>
                        <button type="button" class={styles.cancelBtn} onClick={() => props.onClose()}>
                            Cancel
                        </button>
                        <button type="submit" class={styles.submitBtn} disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
