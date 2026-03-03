import { createSignal, type JSX } from "solid-js";
import { DebouncedInput } from "@/components/primitives/DebouncedInput";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function DebouncedInputDemo(): JSX.Element {
    const [defaultValue, setDefaultValue] = createSignal("");
    const [slowValue, setSlowValue] = createSignal("");

    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="DebouncedInputDemo">
                <h2>DebouncedInput</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    A text input that delays emitting <code>onChange</code> until the user stops typing. Useful for
                    search fields and filters.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Default debounce">
                        <h3>Default debounce (400ms)</h3>
                        <div style={{ "max-width": "400px" }}>
                            <DebouncedInput
                                value={defaultValue()}
                                onChange={setDefaultValue}
                                placeholder="Type something..."
                            />
                            <p style={{ color: "var(--muted-foreground)", "margin-top": "0.5rem" }}>
                                Debounced value: <strong>{defaultValue() || "(empty)"}</strong>
                            </p>
                        </div>
                    </section>

                    <section data-label="Slow debounce">
                        <h3>Slow debounce (1000ms)</h3>
                        <div style={{ "max-width": "400px" }}>
                            <DebouncedInput
                                value={slowValue()}
                                onChange={setSlowValue}
                                debounceMs={1000}
                                placeholder="Type and wait 1 second..."
                            />
                            <p style={{ color: "var(--muted-foreground)", "margin-top": "0.5rem" }}>
                                Debounced value: <strong>{slowValue() || "(empty)"}</strong>
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
