import { createSignal, type JSX } from "solid-js";
import { Select } from "@/components/primitives/Select";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function SelectDemo(): JSX.Element {
    const [basicValue, setBasicValue] = createSignal("banana");
    const [sizeValue, setSizeValue] = createSignal("medium");
    const [groupValue, setGroupValue] = createSignal("claude-opus");

    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="SelectDemo">
                <h2>Select</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    A dropdown select with support for flat options, grouped options, sizes, loading, and disabled states.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Basic select">
                        <h3>Basic</h3>
                        <Select
                            value={basicValue()}
                            onChange={setBasicValue}
                            options={[
                                { value: "apple", label: "Apple" },
                                { value: "banana", label: "Banana" },
                                { value: "cherry", label: "Cherry" },
                                { value: "dragonfruit", label: "Dragonfruit" },
                            ]}
                        />
                        <p style={{ color: "var(--muted-foreground)", "margin-top": "0.5rem" }}>
                            Selected: {basicValue()}
                        </p>
                    </section>

                    <section data-label="With placeholder">
                        <h3>With placeholder</h3>
                        <Select
                            value=""
                            onChange={() => {}}
                            options={[
                                { value: "option1", label: "Option 1" },
                                { value: "option2", label: "Option 2" },
                            ]}
                            placeholder="Choose an option..."
                        />
                    </section>

                    <section data-label="Sizes">
                        <h3>Sizes</h3>
                        <div style={{ display: "flex", "flex-direction": "column", gap: "0.75rem" }}>
                            <div>
                                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.25rem" }}>Default (medium)</p>
                                <Select
                                    value={sizeValue()}
                                    onChange={setSizeValue}
                                    options={[
                                        { value: "small", label: "Small" },
                                        { value: "medium", label: "Medium" },
                                        { value: "large", label: "Large" },
                                    ]}
                                />
                            </div>
                            <div>
                                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.25rem" }}>Small</p>
                                <Select
                                    value={sizeValue()}
                                    onChange={setSizeValue}
                                    size="small"
                                    options={[
                                        { value: "small", label: "Small" },
                                        { value: "medium", label: "Medium" },
                                        { value: "large", label: "Large" },
                                    ]}
                                />
                            </div>
                            <div>
                                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.25rem" }}>Extra small</p>
                                <Select
                                    value={sizeValue()}
                                    onChange={setSizeValue}
                                    size="xsmall"
                                    options={[
                                        { value: "small", label: "Small" },
                                        { value: "medium", label: "Medium" },
                                        { value: "large", label: "Large" },
                                    ]}
                                />
                            </div>
                            <div>
                                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.25rem" }}>Inherit</p>
                                <Select
                                    value={sizeValue()}
                                    onChange={setSizeValue}
                                    size="inherit"
                                    options={[
                                        { value: "small", label: "Small" },
                                        { value: "medium", label: "Medium" },
                                        { value: "large", label: "Large" },
                                    ]}
                                />
                            </div>
                        </div>
                    </section>

                    <section data-label="Grouped options">
                        <h3>Grouped options</h3>
                        <Select
                            value={groupValue()}
                            onChange={setGroupValue}
                            groups={[
                                {
                                    label: "Anthropic",
                                    options: [
                                        { value: "claude-opus", label: "Claude Opus" },
                                        { value: "claude-sonnet", label: "Claude Sonnet" },
                                        { value: "claude-haiku", label: "Claude Haiku" },
                                    ],
                                },
                                {
                                    label: "OpenAI",
                                    options: [
                                        { value: "gpt-4o", label: "GPT-4o" },
                                        { value: "gpt-4o-mini", label: "GPT-4o Mini" },
                                    ],
                                },
                            ]}
                        />
                        <p style={{ color: "var(--muted-foreground)", "margin-top": "0.5rem" }}>
                            Selected: {groupValue()}
                        </p>
                    </section>

                    <section data-label="Loading state">
                        <h3>Loading</h3>
                        <Select
                            value=""
                            onChange={() => {}}
                            options={[]}
                            loading
                            placeholder="Loading options..."
                        />
                    </section>

                    <section data-label="Disabled">
                        <h3>Disabled</h3>
                        <Select
                            value="banana"
                            onChange={() => {}}
                            options={[
                                { value: "apple", label: "Apple" },
                                { value: "banana", label: "Banana" },
                            ]}
                            disabled
                        />
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
