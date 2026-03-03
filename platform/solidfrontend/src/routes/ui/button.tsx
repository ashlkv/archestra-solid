import { For, type JSX } from "solid-js";
import { Settings, Trash2, Plus, Search } from "@/components/icons";
import { Button } from "@/components/primitives/Button";
import { UiLayout } from "@/components/ui-demo/UiLayout";

const VARIANTS = ["default", "ghost", "outline", "info", "success", "warning", "destructive"] as const;
const TEXT_SIZES = ["large", "medium", "small", "xsmall", "inherit"] as const;
const ICON_SIZES = ["icon", "icon-medium", "icon-small", "icon-xsmall"] as const;

export default function ButtonDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="ButtonDemo">
                <h2>Button</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Clickable element for actions and navigation. Supports variants, sizes, icon-only modes, disabled state, and tooltips.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Variants">
                        <h3>Variants</h3>
                        <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem", "margin-top": "0.5rem", "align-items": "center" }}>
                            <For each={VARIANTS}>
                                {(variant) => <Button variant={variant}>{variant}</Button>}
                            </For>
                        </div>
                    </section>

                    <section data-label="Text sizes">
                        <h3>Text sizes</h3>
                        <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem", "margin-top": "0.5rem", "align-items": "center" }}>
                            <For each={TEXT_SIZES}>
                                {(size) => <Button size={size}>{size}</Button>}
                            </For>
                        </div>
                    </section>

                    <section data-label="Icon sizes">
                        <h3>Icon sizes</h3>
                        <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem", "margin-top": "0.5rem", "align-items": "center" }}>
                            <For each={ICON_SIZES}>
                                {(size) => (
                                    <Button size={size} tooltip={size}>
                                        <Settings size={size === "icon-xsmall" ? 12 : size === "icon-small" ? 14 : 16} />
                                    </Button>
                                )}
                            </For>
                        </div>
                    </section>

                    <section data-label="With icons">
                        <h3>With icons and text</h3>
                        <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem", "margin-top": "0.5rem", "align-items": "center" }}>
                            <Button>
                                <Plus size={16} /> Create
                            </Button>
                            <Button variant="outline">
                                <Search size={16} /> Search
                            </Button>
                            <Button variant="destructive">
                                <Trash2 size={16} /> Delete
                            </Button>
                        </div>
                    </section>

                    <section data-label="Disabled">
                        <h3>Disabled</h3>
                        <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem", "margin-top": "0.5rem", "align-items": "center" }}>
                            <Button disabled>Default disabled</Button>
                            <Button variant="outline" disabled>Outline disabled</Button>
                            <Button variant="destructive" disabled>Destructive disabled</Button>
                        </div>
                    </section>

                    <section data-label="With tooltip">
                        <h3>With tooltip</h3>
                        <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem", "margin-top": "0.5rem", "align-items": "center" }}>
                            <Button tooltip="This is a tooltip">Hover me</Button>
                            <Button variant="outline" size="icon" tooltip="Settings">
                                <Settings size={16} />
                            </Button>
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
