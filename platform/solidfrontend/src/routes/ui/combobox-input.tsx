import { createSignal, type JSX } from "solid-js";
import { ComboboxInput, type ComboboxOption } from "@/components/primitives/ComboboxInput";
import { UiLayout } from "@/components/ui-demo/UiLayout";

const FRUIT_OPTIONS: ComboboxOption[] = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "cherry", label: "Cherry" },
    { value: "grape", label: "Grape" },
    { value: "kiwi", label: "Kiwi" },
    { value: "mango", label: "Mango" },
    { value: "orange", label: "Orange" },
    { value: "peach", label: "Peach" },
    { value: "strawberry", label: "Strawberry" },
];

const MODEL_OPTIONS: ComboboxOption[] = [
    { value: "gpt-4o", label: "GPT-4o" },
    { value: "gpt-4o-mini", label: "GPT-4o Mini" },
    { value: "claude-opus-4-1-20250805", label: "Claude Opus 4.1" },
    { value: "claude-sonnet-4-20250514", label: "Claude Sonnet 4" },
    { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
];

export default function ComboboxInputDemo(): JSX.Element {
    const [fruit, setFruit] = createSignal("");
    const [model, setModel] = createSignal("gpt-4o");
    const [custom, setCustom] = createSignal("");
    const [smallValue, setSmallValue] = createSignal("");

    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="ComboboxInputDemo">
                <h2>ComboboxInput</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Searchable dropdown that allows selecting from options or typing a custom value. Supports placeholder text, filtering, and size variants.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Basic">
                        <h3>Basic</h3>
                        <div style={{ "max-width": "300px", "margin-top": "0.5rem" }}>
                            <ComboboxInput
                                value={fruit()}
                                onChange={setFruit}
                                options={FRUIT_OPTIONS}
                                placeholder="Select a fruit"
                                inputPlaceholder="Search fruits..."
                            />
                            <p style={{ "margin-top": "0.5rem", color: "var(--muted-foreground)" }}>
                                Selected: {fruit() || "(none)"}
                            </p>
                        </div>
                    </section>

                    <section data-label="With preselected value">
                        <h3>With preselected value</h3>
                        <div style={{ "max-width": "300px", "margin-top": "0.5rem" }}>
                            <ComboboxInput
                                value={model()}
                                onChange={setModel}
                                options={MODEL_OPTIONS}
                                placeholder="Select a model"
                                inputPlaceholder="Search models..."
                            />
                            <p style={{ "margin-top": "0.5rem", color: "var(--muted-foreground)" }}>
                                Selected: {model()}
                            </p>
                        </div>
                    </section>

                    <section data-label="Custom input">
                        <h3>Custom input (type anything)</h3>
                        <div style={{ "max-width": "300px", "margin-top": "0.5rem" }}>
                            <ComboboxInput
                                value={custom()}
                                onChange={setCustom}
                                options={FRUIT_OPTIONS}
                                placeholder="Select or type..."
                                inputPlaceholder="Type a value..."
                            />
                            <p style={{ "margin-top": "0.5rem", color: "var(--muted-foreground)" }}>
                                Value: {custom() || "(empty)"}
                            </p>
                        </div>
                    </section>

                    <section data-label="Small size">
                        <h3>Small size</h3>
                        <div style={{ "max-width": "250px", "margin-top": "0.5rem" }}>
                            <ComboboxInput
                                value={smallValue()}
                                onChange={setSmallValue}
                                options={FRUIT_OPTIONS}
                                placeholder="Small combobox"
                                size="small"
                            />
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
