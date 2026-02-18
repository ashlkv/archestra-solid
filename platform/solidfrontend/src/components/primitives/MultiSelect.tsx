import { Combobox } from "@kobalte/core/combobox";
import { createSignal, For, type JSX, Show } from "solid-js";
import { Check, ChevronDown } from "@/components/icons";
import styles from "./MultiSelect.module.css";
import { Tag } from "./Tag";

interface Option {
    value: string;
    label: string;
}

export function MultiSelect(props: {
    value: string[];
    onChange: (value: string[]) => void;
    options: Option[];
    placeholder?: string;
    disabled?: boolean;
    tagsLayout?: "horizontal" | "vertical";
    renderTag?: (option: Option, onDelete: () => void) => JSX.Element;
}): JSX.Element {
    const [inputValue, setInputValue] = createSignal("", { name: "inputValue" });

    const selectedOptions = () => props.options.filter((o) => props.value.includes(o.value));

    const filteredOptions = () => {
        const search = inputValue().toLowerCase();
        if (!search) return props.options;
        return props.options.filter((o) => o.label.toLowerCase().includes(search));
    };

    const removeOption = (value: string) => {
        props.onChange(props.value.filter((v) => v !== value));
    };

    const tagsClass = () => (props.tagsLayout === "vertical" ? styles["tags-vertical"] : styles.tags);

    return (
        <div class={styles.container}>
            <Show when={selectedOptions().length > 0}>
                <div class={tagsClass()}>
                    <For each={selectedOptions()}>
                        {(option) => (
                            <Show
                                when={props.renderTag}
                                fallback={
                                    <Tag
                                        size="regular"
                                        variant="muted"
                                        onDelete={() => removeOption(option.value)}
                                        onPointerDown={(e) => e.stopPropagation()}
                                    >
                                        {option.label}
                                    </Tag>
                                }
                            >
                                {(renderTag) => renderTag()(option, () => removeOption(option.value))}
                            </Show>
                        )}
                    </For>
                </div>
            </Show>

            <Combobox<Option>
                multiple
                options={filteredOptions()}
                optionValue="value"
                optionTextValue="label"
                optionLabel="label"
                value={selectedOptions()}
                onChange={(options) => props.onChange(options.map((o) => o.value))}
                onInputChange={setInputValue}
                placeholder={props.placeholder}
                disabled={props.disabled}
                itemComponent={(itemProps) => (
                    <Combobox.Item item={itemProps.item} class={styles.item}>
                        <Combobox.ItemLabel class={styles.itemLabel}>
                            {itemProps.item.rawValue.label}
                        </Combobox.ItemLabel>
                        <Combobox.ItemIndicator class={styles.itemIndicator}>
                            <Check size={14} />
                        </Combobox.ItemIndicator>
                    </Combobox.Item>
                )}
            >
                <Combobox.Control class={styles.control}>
                    <Combobox.Input class={styles.input} />
                    <Combobox.Trigger class={styles.trigger}>
                        <Combobox.Icon class={styles.icon}>
                            <ChevronDown size={16} />
                        </Combobox.Icon>
                    </Combobox.Trigger>
                </Combobox.Control>
                <Combobox.Portal>
                    <Combobox.Content class={styles.content}>
                        <Combobox.Listbox />
                    </Combobox.Content>
                </Combobox.Portal>
            </Combobox>
        </div>
    );
}
