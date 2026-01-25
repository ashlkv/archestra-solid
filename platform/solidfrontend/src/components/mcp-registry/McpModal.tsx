import { createSignal, Show } from "solid-js";
import styles from "./McpModal.module.css";
import { useUpdateMcp } from '@/lib/mcp-registry.query';
import { MCP } from '~/types';

export function McpModal(props: { item: Pick<MCP, 'id' | 'name'>; onClose: () => void; }) {
    const [name, setName] = createSignal(props.item.name);

    const { submit, submission } = useUpdateMcp()

    const onSubmit = async (event: Event) => {
        event.preventDefault();
        await submit({
            id: props.item.id,
            name: name(),
        });
        props.onClose();
    };

    return (
        <div class={styles.backdrop} onClick={() => props.onClose()}>
            <div class={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2>Edit Catalog Item</h2>

                <form onSubmit={onSubmit}>
                    <label>
                        Name
                        <input type="text" value={name()} onInput={(e) => setName(e.currentTarget.value)} required />
                    </label>
                    <Show when={Boolean(submission.error)}><p>{submission.error?.message}</p></Show>

                    <div class={styles.actions}>
                        <button type="button" class={styles.cancelBtn} onClick={() => props.onClose()}>
                            Cancel
                        </button>
                        <button type="submit" class={styles.submitBtn} disabled={submission.pending}>
                            {submission.pending ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
