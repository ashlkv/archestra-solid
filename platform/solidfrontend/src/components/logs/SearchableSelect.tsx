import { createSignal, For, type JSX, Show } from "solid-js";
import { Check, ChevronDown } from "@/components/icons";
import { Button } from "@/components/primitives/Button";
import { Input } from "@/components/primitives/Input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/primitives/Popover";

export function SearchableSelect(props: {
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    items: Array<{ value: string; label: string }>;
}): JSX.Element {
    const [searchQuery, setSearchQuery] = createSignal("");

    const filteredItems = () => {
        const query = searchQuery().toLowerCase();
        if (!query) return props.items;
        return props.items.filter((item) => item.label.toLowerCase().includes(query));
    };

    const selectedLabel = () => {
        const item = props.items.find((item) => item.value === props.value);
        return item?.label ?? props.value ?? props.placeholder ?? "Select...";
    };

    return (
        <Popover>
            <PopoverTrigger>
                <Button
                    variant="outline"
                    size="small"
                    style={{ "min-width": "160px", "justify-content": "space-between" }}
                >
                    <span style={{ overflow: "hidden", "text-overflow": "ellipsis", "white-space": "nowrap" }}>
                        {selectedLabel()}
                    </span>
                    <ChevronDown style={{ width: "14px", height: "14px", opacity: 0.5, "flex-shrink": 0 }} />
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <div data-label="SearchableSelect" style={{ "min-width": "200px" }}>
                    <div style={{ padding: "0.5rem" }}>
                        <Input
                            value={searchQuery()}
                            onInput={(value) => setSearchQuery(value)}
                            placeholder={props.searchPlaceholder ?? "Search..."}
                        />
                    </div>
                    <div style={{ "max-height": "250px", "overflow-y": "auto", padding: "0.25rem" }}>
                        <Show when={filteredItems().length === 0}>
                            <div
                                style={{
                                    padding: "1rem",
                                    "text-align": "center",
                                    "font-size": "var(--small-font-size)",
                                    color: "var(--muted-foreground)",
                                }}
                            >
                                No results found.
                            </div>
                        </Show>
                        <For each={filteredItems()}>
                            {(item) => (
                                <button
                                    type="button"
                                    style={{
                                        display: "flex",
                                        width: "100%",
                                        "align-items": "center",
                                        "justify-content": "space-between",
                                        padding: "0.375rem 0.5rem",
                                        border: "none",
                                        background: props.value === item.value ? "var(--background)" : "transparent",
                                        color: "var(--foreground)",
                                        "font-size": "var(--small-font-size)",
                                        "border-radius": "var(--radius)",
                                        cursor: "pointer",
                                        "text-align": "left",
                                    }}
                                    onClick={() => {
                                        props.onValueChange(item.value);
                                        setSearchQuery("");
                                    }}
                                >
                                    <span
                                        style={{
                                            overflow: "hidden",
                                            "text-overflow": "ellipsis",
                                            "white-space": "nowrap",
                                        }}
                                    >
                                        {item.label}
                                    </span>
                                    <Show when={props.value === item.value}>
                                        <Check style={{ width: "14px", height: "14px", "flex-shrink": 0 }} />
                                    </Show>
                                </button>
                            )}
                        </For>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
