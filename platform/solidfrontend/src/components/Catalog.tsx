import { For, Show } from "solid-js";
import { CatalogCard } from "./CatalogCard.tsx";
import styles from "./Catalog.module.css";
import { MCP } from '@/types';

export function Catalog(props: {
                               catalog: MCP[] | undefined;
                               error?: boolean;
    pending?: boolean;
                             }
) {

  return (
    <main class={styles.main}>
      <header class={styles.header}>
        <h1 class={styles.title}>MCP Catalog</h1>
      </header>

      <Show when={props.pending}>
        <p>Loading</p>
      </Show>

      <Show when={props.error}>
        <p class={styles.error}>Failed to load catalog</p>
      </Show>

      <Show when={props.catalog && props.catalog.length === 0}>
        <p>No catalog items</p>
      </Show>

      <ul class={styles.list}>
        <For each={props.catalog} by={(item) => item.id}>
          {(item) => (
            <CatalogCard
              item={{
                id: item.id,
                name: item.name,
                serverType: item.serverType,
              }}
            />
          )}
        </For>
      </ul>
    </main>
  );
}
