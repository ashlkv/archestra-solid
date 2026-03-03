import { createSignal, type JSX } from "solid-js";
import { UiLayout } from "@/components/ui-demo/UiLayout";
import { Textarea } from "@/components/primitives/Textarea";

export default function TextareaDemo(): JSX.Element {
    const [value, setValue] = createSignal("");

    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="TextareaDemo">
                <h2>Textarea</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Multi-line text input with support for monospace font, resize control, placeholder, and disabled
                    state.
                </p>

                <section data-label="Default">
                    <h3>Default</h3>
                    <Textarea placeholder="Enter a description..." onInput={setValue} value={value()} />
                    <p style={{ color: "var(--muted-foreground)", "margin-top": "0.25rem" }}>
                        Characters: {value().length}
                    </p>
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="Monospace">
                    <h3>Monospace</h3>
                    <Textarea
                        mono
                        placeholder="Enter JSON or code..."
                        value={'{\n  "model": "claude-opus-4-1-20250805",\n  "max_tokens": 1024\n}'}
                        rows={5}
                    />
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="No resize">
                    <h3>Resize disabled</h3>
                    <Textarea resize={false} placeholder="This textarea cannot be resized" rows={3} />
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="Custom rows">
                    <h3>Custom rows</h3>
                    <div style={{ display: "flex", "flex-direction": "column", gap: "1rem" }}>
                        <div>
                            <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.25rem" }}>2 rows</p>
                            <Textarea rows={2} placeholder="2 rows" />
                        </div>
                        <div>
                            <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.25rem" }}>6 rows</p>
                            <Textarea rows={6} placeholder="6 rows" />
                        </div>
                    </div>
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="Disabled">
                    <h3>Disabled</h3>
                    <Textarea disabled value="This textarea is disabled and cannot be edited." />
                </section>
            </div>
        </UiLayout>
    );
}
