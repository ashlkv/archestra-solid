import { createSignal, type JSX } from "solid-js";
import { TextInput } from "@/components/common/TextInput";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function TextInputDemo(): JSX.Element {
    const [singleLineValue, setSingleLineValue] = createSignal("Discrete title");
    const [multiLineValue, setMultiLineValue] = createSignal("A discreet multiline input.\nIt keeps the underline treatment.");

    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="TextInputDemo">
                <h2>Text input</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem", "max-width": "42rem" }}>
                    Higher-level input built on top of editable text with a subtle underline and light muted background.
                </p>

                <div style={{ display: "grid", gap: "2rem" }}>
                    <section data-label="Single line input">
                        <h3>Single line input</h3>
                        <TextInput
                            value={singleLineValue()}
                            multiline={false}
                            placeholder="Type a short title"
                            onInput={setSingleLineValue}
                            onUpdate={setSingleLineValue}
                        />
                    </section>

                    <section data-label="Single line input">
                        <h3>Single line input, no value</h3>
                        <TextInput
                            multiline={false}
                            placeholder="Type a short title"
                            onInput={setSingleLineValue}
                            onUpdate={setSingleLineValue}
                        />
                    </section>

                    <section data-label="Multiline input">
                        <h3>Multiline input</h3>
                        <TextInput
                            value={multiLineValue()}
                            multiline={true}
                            placeholder="Type a longer answer"
                            onInput={setMultiLineValue}
                            onUpdate={setMultiLineValue}
                        />
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
