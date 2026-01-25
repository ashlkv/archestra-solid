import { For, Show } from "solid-js";
import { McpCard } from "./McpCard";
import { Alert } from "../primitives/Alert";
import { Grid } from "../primitives/Grid";
import { MCP } from "@/types";

export function McpRegistry(props: {
    catalog: MCP[] | undefined;
    error?: boolean;
    pending?: boolean;
}) {
    return (
        <>
            <Show when={props.pending}>
                <p>Loading</p>
            </Show>

            <Show when={props.error}>
                <Alert variant="destructive">Failed to load catalog</Alert>
            </Show>

            <Show when={props.catalog && props.catalog.length === 0}>
                <p>No catalog items</p>
            </Show>

            <Grid columns={2}>
                <For each={props.catalog} by={(item) => item.id}>
                    {(item) => <McpCard item={item} />}
                </For>
            </Grid>
        </>
    );
}
