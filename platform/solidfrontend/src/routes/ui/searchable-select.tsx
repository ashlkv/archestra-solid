import { createSignal, type JSX } from "solid-js";
import { SearchableSelect } from "@/components/primitives/SearchableSelect";
import { UiLayout } from "@/components/ui-demo/UiLayout";

const COUNTRIES = [
    { value: "us", label: "United States" },
    { value: "gb", label: "United Kingdom" },
    { value: "de", label: "Germany" },
    { value: "fr", label: "France" },
    { value: "jp", label: "Japan" },
    { value: "au", label: "Australia" },
    { value: "ca", label: "Canada" },
    { value: "br", label: "Brazil" },
    { value: "in", label: "India" },
    { value: "kr", label: "South Korea" },
];

const LANGUAGES = [
    { value: "ts", label: "TypeScript" },
    { value: "rs", label: "Rust" },
    { value: "go", label: "Go" },
    { value: "py", label: "Python" },
    { value: "rb", label: "Ruby" },
    { value: "java", label: "Java" },
    { value: "cs", label: "C#" },
    { value: "swift", label: "Swift" },
    { value: "kt", label: "Kotlin" },
    { value: "zig", label: "Zig" },
];

export default function SearchableSelectDemo(): JSX.Element {
    const [country, setCountry] = createSignal("");
    const [language, setLanguage] = createSignal("");

    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="SearchableSelectDemo">
                <h2>SearchableSelect</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    A dropdown select with a built-in search filter. Opens as a popover with keyboard-friendly item
                    selection.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Countries">
                        <h3>Countries</h3>
                        <div style={{ "max-width": "400px" }}>
                            <SearchableSelect
                                value={country()}
                                onValueChange={setCountry}
                                placeholder="Select a country"
                                searchPlaceholder="Search countries..."
                                items={COUNTRIES}
                            />
                            <p style={{ color: "var(--muted-foreground)", "margin-top": "0.5rem" }}>
                                Selected: <strong>{country() || "(none)"}</strong>
                            </p>
                        </div>
                    </section>

                    <section data-label="Languages">
                        <h3>Programming languages</h3>
                        <div style={{ "max-width": "400px" }}>
                            <SearchableSelect
                                value={language()}
                                onValueChange={setLanguage}
                                placeholder="Pick a language"
                                searchPlaceholder="Search languages..."
                                items={LANGUAGES}
                            />
                            <p style={{ color: "var(--muted-foreground)", "margin-top": "0.5rem" }}>
                                Selected: <strong>{language() || "(none)"}</strong>
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
