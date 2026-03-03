import { createSignal, For, type JSX, Show } from "solid-js";
import { UiLayout } from "@/components/ui-demo/UiLayout";
import { Tag } from "@/components/primitives/Tag";

export default function TagDemo(): JSX.Element {
    const [tags, setTags] = createSignal(["kubernetes", "mcp-server", "production", "v2.1.0"]);
    const [mutedTags, setMutedTags] = createSignal(["deprecated", "legacy", "archived"]);

    const removeTag = (tag: string) => setTags((previous) => previous.filter((t) => t !== tag));
    const removeMutedTag = (tag: string) => setMutedTags((previous) => previous.filter((t) => t !== tag));

    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="TagDemo">
                <h2>Tag</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Small labels with an optional delete button. Supports two sizes (small, regular) and two variants
                    (primary, muted).
                </p>

                <section data-label="Sizes">
                    <h3>Sizes</h3>
                    <div style={{ display: "flex", gap: "0.5rem", "align-items": "center", "flex-wrap": "wrap" }}>
                        <Tag size="small" onDelete={() => {}}>
                            small (default)
                        </Tag>
                        <Tag size="regular" onDelete={() => {}}>
                            regular
                        </Tag>
                    </div>
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="Variants">
                    <h3>Variants</h3>
                    <div style={{ display: "flex", gap: "0.5rem", "align-items": "center", "flex-wrap": "wrap" }}>
                        <Tag variant="primary" onDelete={() => {}}>
                            primary (default)
                        </Tag>
                        <Tag variant="muted" onDelete={() => {}}>
                            muted
                        </Tag>
                    </div>
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="Interactive primary tags">
                    <h3>Interactive - primary</h3>
                    <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.5rem" }}>
                        Click the X to remove tags.
                    </p>
                    <div style={{ display: "flex", gap: "0.5rem", "align-items": "center", "flex-wrap": "wrap" }}>
                        <For each={tags()}>
                            {(tag) => (
                                <Tag size="small" onDelete={() => removeTag(tag)} data-label={`Tag: ${tag}`}>
                                    {tag}
                                </Tag>
                            )}
                        </For>
                        <Show when={tags().length === 0}>
                            <span style={{ color: "var(--muted-foreground)" }}>All tags removed</span>
                        </Show>
                    </div>
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="Interactive muted tags">
                    <h3>Interactive - muted</h3>
                    <div style={{ display: "flex", gap: "0.5rem", "align-items": "center", "flex-wrap": "wrap" }}>
                        <For each={mutedTags()}>
                            {(tag) => (
                                <Tag
                                    size="regular"
                                    variant="muted"
                                    onDelete={() => removeMutedTag(tag)}
                                    data-label={`Tag: ${tag}`}
                                >
                                    {tag}
                                </Tag>
                            )}
                        </For>
                        <Show when={mutedTags().length === 0}>
                            <span style={{ color: "var(--muted-foreground)" }}>All tags removed</span>
                        </Show>
                    </div>
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="All combinations">
                    <h3>All combinations</h3>
                    <div
                        style={{
                            display: "grid",
                            "grid-template-columns": "auto 1fr 1fr",
                            gap: "0.75rem",
                            "align-items": "center",
                        }}
                    >
                        <div />
                        <strong>Primary</strong>
                        <strong>Muted</strong>

                        <strong>Small</strong>
                        <div>
                            <Tag size="small" variant="primary" onDelete={() => {}}>
                                small primary
                            </Tag>
                        </div>
                        <div>
                            <Tag size="small" variant="muted" onDelete={() => {}}>
                                small muted
                            </Tag>
                        </div>

                        <strong>Regular</strong>
                        <div>
                            <Tag size="regular" variant="primary" onDelete={() => {}}>
                                regular primary
                            </Tag>
                        </div>
                        <div>
                            <Tag size="regular" variant="muted" onDelete={() => {}}>
                                regular muted
                            </Tag>
                        </div>
                    </div>
                </section>
            </div>
        </UiLayout>
    );
}
