import { createSignal, type JSX } from "solid-js";
import { MultiSelect } from "@/components/primitives/MultiSelect";
import { Tag } from "@/components/primitives/Tag";
import { UiLayout } from "@/components/ui-demo/UiLayout";

const FRUIT_OPTIONS = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "cherry", label: "Cherry" },
    { value: "grape", label: "Grape" },
    { value: "mango", label: "Mango" },
    { value: "orange", label: "Orange" },
    { value: "peach", label: "Peach" },
    { value: "strawberry", label: "Strawberry" },
];

const TEAM_OPTIONS = [
    { value: "engineering", label: "Engineering" },
    { value: "design", label: "Design" },
    { value: "product", label: "Product" },
    { value: "marketing", label: "Marketing" },
    { value: "sales", label: "Sales" },
];

const TOOL_OPTIONS = [
    { value: "read_file", label: "read_file" },
    { value: "write_file", label: "write_file" },
    { value: "execute_sql", label: "execute_sql" },
    { value: "search_web", label: "search_web" },
    { value: "send_email", label: "send_email" },
    { value: "create_issue", label: "create_issue" },
];

export default function MultiSelectDemo(): JSX.Element {
    const [fruits, setFruits] = createSignal<string[]>(["apple", "cherry"]);
    const [teams, setTeams] = createSignal<string[]>([]);
    const [tools, setTools] = createSignal<string[]>(["read_file", "write_file"]);
    const [disabledValue, setDisabledValue] = createSignal<string[]>(["engineering", "design"]);
    const [verticalValue, setVerticalValue] = createSignal<string[]>(["apple", "banana", "cherry"]);

    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="MultiSelectDemo">
                <h2>MultiSelect</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    A searchable multi-select combobox with tag chips, built on Kobalte Combobox.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Basic multi-select">
                        <h3>Basic multi-select</h3>
                        <div style={{ "max-width": "400px" }}>
                            <MultiSelect
                                value={fruits()}
                                onChange={setFruits}
                                options={FRUIT_OPTIONS}
                                placeholder="Select fruits..."
                            />
                            <p style={{ color: "var(--muted-foreground)", "margin-top": "0.5rem" }}>
                                Selected: {fruits().join(", ") || "none"}
                            </p>
                        </div>
                    </section>

                    <section data-label="Empty state">
                        <h3>Empty state with placeholder</h3>
                        <div style={{ "max-width": "400px" }}>
                            <MultiSelect
                                value={teams()}
                                onChange={setTeams}
                                options={TEAM_OPTIONS}
                                placeholder="Search and select teams..."
                            />
                        </div>
                    </section>

                    <section data-label="Disabled">
                        <h3>Disabled</h3>
                        <div style={{ "max-width": "400px" }}>
                            <MultiSelect
                                value={disabledValue()}
                                onChange={setDisabledValue}
                                options={TEAM_OPTIONS}
                                placeholder="Cannot modify"
                                disabled
                            />
                        </div>
                    </section>

                    <section data-label="Vertical tags layout">
                        <h3>Vertical tags layout</h3>
                        <div style={{ "max-width": "400px" }}>
                            <MultiSelect
                                value={verticalValue()}
                                onChange={setVerticalValue}
                                options={FRUIT_OPTIONS}
                                placeholder="Select fruits..."
                                tagsLayout="vertical"
                            />
                        </div>
                    </section>

                    <section data-label="Custom tag renderer">
                        <h3>Custom tag renderer</h3>
                        <div style={{ "max-width": "400px" }}>
                            <MultiSelect
                                value={tools()}
                                onChange={setTools}
                                options={TOOL_OPTIONS}
                                placeholder="Select tools..."
                                renderTag={(option, onDelete) => (
                                    <Tag
                                        size="regular"
                                        variant="secondary"
                                        onDelete={onDelete}
                                        onPointerDown={(event) => event.stopPropagation()}
                                    >
                                        {option.label}
                                    </Tag>
                                )}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
