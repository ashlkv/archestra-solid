import { createSignal, type JSX } from "solid-js";
import { SearchInput } from "@/components/primitives/SearchInput";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function SearchInputDemo(): JSX.Element {
    const [basicValue, setBasicValue] = createSignal("");
    const [debouncedValue, setDebouncedValue] = createSignal("");
    const [fastValue, setFastValue] = createSignal("");
    const [slowValue, setSlowValue] = createSignal("");

    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="SearchInputDemo">
                <h2>SearchInput</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    A search input with a magnifying glass icon and built-in debounce support.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Basic search">
                        <h3>Basic</h3>
                        <SearchInput value={basicValue()} onChange={setBasicValue} />
                        <p style={{ color: "var(--muted-foreground)", "margin-top": "0.5rem" }}>
                            Debounced value: "{basicValue()}"
                        </p>
                    </section>

                    <section data-label="With placeholder">
                        <h3>With placeholder</h3>
                        <SearchInput
                            value={debouncedValue()}
                            onChange={setDebouncedValue}
                            placeholder="Search MCP servers..."
                        />
                        <p style={{ color: "var(--muted-foreground)", "margin-top": "0.5rem" }}>
                            Debounced value: "{debouncedValue()}"
                        </p>
                    </section>

                    <section data-label="Fast debounce">
                        <h3>Fast debounce (100ms)</h3>
                        <SearchInput
                            value={fastValue()}
                            onChange={setFastValue}
                            debounceMs={100}
                            placeholder="Fast search..."
                        />
                        <p style={{ color: "var(--muted-foreground)", "margin-top": "0.5rem" }}>
                            Value: "{fastValue()}"
                        </p>
                    </section>

                    <section data-label="Slow debounce">
                        <h3>Slow debounce (1000ms)</h3>
                        <SearchInput
                            value={slowValue()}
                            onChange={setSlowValue}
                            debounceMs={1000}
                            placeholder="Slow search (1s debounce)..."
                        />
                        <p style={{ color: "var(--muted-foreground)", "margin-top": "0.5rem" }}>
                            Value: "{slowValue()}"
                        </p>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
