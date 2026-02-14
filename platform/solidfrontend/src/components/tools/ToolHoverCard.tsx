import { For, type JSX, Show } from "solid-js";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../primitives/HoverCard";
import { Markdown } from "../primitives/Markdown";
import styles from "./ToolHoverCard.module.css";

type JsonSchema = {
    type?: string;
    properties?: Record<string, { type?: string; description?: string }>;
    required?: string[];
};

export function ToolHoverCard(props: {
    name: string;
    description: string | null;
    parameters: JsonSchema | undefined;
    children: JSX.Element;
}): JSX.Element {
    const params = () => {
        const schema = props.parameters;
        if (!schema?.properties) return [];
        const required = new Set(schema.required ?? []);
        return Object.entries(schema.properties).map(([name, prop]) => ({
            name,
            type: prop.type ?? "unknown",
            description: prop.description,
            required: required.has(name),
        }));
    };

    return (
        <HoverCard>
            <HoverCardTrigger>{props.children}</HoverCardTrigger>
            <HoverCardContent>
                <div class={styles.card}>
                    <div class={styles.signature}>
                        <span class={styles.name}>{props.name}</span>
                        <span class={styles.parens}>(</span>
                        <For each={params()}>
                            {(param, index) => (
                                <>
                                    <span class={param.required ? styles["param-required"] : styles.param}>
                                        {param.name}
                                    </span>
                                    <span class={styles.colon}>:</span>
                                    <span class={styles.type}>{param.type}</span>
                                    <Show when={index() < params().length - 1}>
                                        <span class={styles.comma}>,</span>
                                    </Show>
                                </>
                            )}
                        </For>
                        <span class={styles.parens}>)</span>
                    </div>
                    <Show when={props.description}>
                        <Markdown class={styles.description}>{props.description ?? undefined}</Markdown>
                    </Show>
                    <Show when={params().length > 0}>
                        <div class={styles.params}>
                            <For each={params()}>
                                {(param) => (
                                    <Show when={param.description}>
                                        <span class={styles["param-name"]}>{param.name}</span>
                                        <Markdown class={styles["param-desc"]}>{param.description}</Markdown>
                                    </Show>
                                )}
                            </For>
                        </div>
                    </Show>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
