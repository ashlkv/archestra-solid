import { createSignal, type JSX } from "solid-js";
import { RadioGroup } from "@/components/primitives/RadioGroup";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function RadioGroupDemo(): JSX.Element {
    const [selectedFruit, setSelectedFruit] = createSignal("apple");
    const [selectedPlan, setSelectedPlan] = createSignal("pro");

    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="RadioGroupDemo">
                <h2>RadioGroup</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    A group of radio buttons allowing single selection from a set of options.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Basic radio group">
                        <h3>Basic</h3>
                        <RadioGroup
                            options={[
                                { value: "apple", label: "Apple" },
                                { value: "banana", label: "Banana" },
                                { value: "cherry", label: "Cherry" },
                            ]}
                        />
                    </section>

                    <section data-label="Controlled radio group">
                        <h3>Controlled (selected: {selectedFruit()})</h3>
                        <RadioGroup
                            value={selectedFruit()}
                            onChange={setSelectedFruit}
                            options={[
                                { value: "apple", label: "Apple" },
                                { value: "banana", label: "Banana" },
                                { value: "cherry", label: "Cherry" },
                                { value: "dragonfruit", label: "Dragonfruit" },
                            ]}
                        />
                    </section>

                    <section data-label="With disabled options">
                        <h3>With disabled options</h3>
                        <RadioGroup
                            value={selectedPlan()}
                            onChange={setSelectedPlan}
                            options={[
                                { value: "free", label: "Free" },
                                { value: "pro", label: "Pro" },
                                { value: "enterprise", label: "Enterprise", disabled: true },
                            ]}
                        />
                    </section>

                    <section data-label="Entirely disabled">
                        <h3>Entirely disabled</h3>
                        <RadioGroup
                            value="light"
                            disabled
                            options={[
                                { value: "light", label: "Light" },
                                { value: "dark", label: "Dark" },
                                { value: "system", label: "System" },
                            ]}
                        />
                    </section>

                    <section data-label="Many options">
                        <h3>Many options</h3>
                        <RadioGroup
                            options={[
                                { value: "red", label: "Red" },
                                { value: "orange", label: "Orange" },
                                { value: "yellow", label: "Yellow" },
                                { value: "green", label: "Green" },
                                { value: "blue", label: "Blue" },
                                { value: "indigo", label: "Indigo" },
                                { value: "violet", label: "Violet" },
                            ]}
                        />
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
