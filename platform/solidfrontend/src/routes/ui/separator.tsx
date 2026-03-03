import type { JSX } from "solid-js";
import { Separator } from "@/components/primitives/Separator";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function SeparatorDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="SeparatorDemo">
                <h2>Separator</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    A horizontal rule for visually separating content sections.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Basic separator">
                        <h3>Basic</h3>
                        <p>Content above the separator</p>
                        <Separator />
                        <p>Content below the separator</p>
                    </section>

                    <section data-label="Between items">
                        <h3>Between list items</h3>
                        <div style={{ border: "1px solid var(--border)", "border-radius": "0.5rem", padding: "1rem" }}>
                            <p>First item</p>
                            <Separator />
                            <p>Second item</p>
                            <Separator />
                            <p>Third item</p>
                            <Separator />
                            <p>Fourth item</p>
                        </div>
                    </section>

                    <section data-label="In a card layout">
                        <h3>In a card layout</h3>
                        <div style={{ border: "1px solid var(--border)", "border-radius": "0.5rem" }}>
                            <div style={{ padding: "1rem" }}>
                                <p style={{ "font-weight": "bold" }}>Card title</p>
                                <p style={{ color: "var(--muted-foreground)" }}>A brief description of the card contents.</p>
                            </div>
                            <Separator />
                            <div style={{ padding: "1rem" }}>
                                <p>Card body content goes here. This section is separated from the header by a separator.</p>
                            </div>
                            <Separator />
                            <div style={{ padding: "1rem", display: "flex", "justify-content": "flex-end" }}>
                                <p style={{ color: "var(--muted-foreground)" }}>Card footer</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
