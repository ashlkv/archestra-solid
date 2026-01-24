import { createSignal } from "solid-js";
import { navigate } from "astro:transitions/client";
import { useUpdateInternalMcpCatalogItem } from "@/lib/internal-mcp-catalog.query";

interface Props {
    item: {
        id: string;
        name: string;
    };
    onClose: () => void;
}

export function EditCatalogModal(props: Props) {
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
            // Revalidate page data
            navigate(window.location.href);
        } catch (err) {
            setError("Failed to update catalog item");
        }
    };

    return (
        <div class="modal-backdrop" onClick={() => props.onClose()}>
            <div class="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Edit Catalog Item</h2>

                <form onSubmit={handleSubmit}>
                    <label>
                        Name
                        <input
                            type="text"
                            value={name()}
                            onInput={(e) => setName(e.currentTarget.value)}
                            required
                        />
                    </label>

                    {error() && <p class="error">{error()}</p>}

                    <div class="actions">
                        <button type="button" onClick={() => props.onClose()}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={updateMutation.isPending}
                        >
                            {updateMutation.isPending ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
