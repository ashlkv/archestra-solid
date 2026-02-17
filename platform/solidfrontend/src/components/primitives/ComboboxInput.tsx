import { Combobox as KobalteCombobox } from "@kobalte/core/combobox";
import { type JSX, Show } from "solid-js";
import { Check, ChevronDown } from "@/components/icons";
import styles from "./ComboboxInput.module.css";

export interface ComboboxOption {
    value: string;
    label: string;
}

interface Props {
    value: string;
    onChange: (value: string) => void;
    options: ComboboxOption[];
    placeholder?: string;
    inputPlaceholder?: string;
    size?: "inherit" | "small";
    class?: string;
}

export function ComboboxInput(props: Props): JSX.Element {
    let suppressNextInputChange = false;

    const selectedOption = () => props.options.find((option) => option.value === props.value) ?? null;
    const iconSize = () => (props.size === "small" ? 14 : 16);
    const displayValue = () => selectedOption()?.label ?? props.value;

    const onSelection = (option: ComboboxOption | null) => {
        if (option) {
            suppressNextInputChange = true;
            props.onChange(option.value);
        }
    };

    const onInputChange = (text: string) => {
        if (suppressNextInputChange) {
            suppressNextInputChange = false;
            return;
        }
        props.onChange(text);
    };

    return (
        <KobalteCombobox
            value={selectedOption()}
            onChange={onSelection}
            onInputChange={onInputChange}
            options={props.options}
            optionValue="value"
            optionTextValue="label"
            optionLabel="label"
            triggerMode="button"
            defaultFilter="contains"
            allowsEmptyCollection={true}
            noResetInputOnBlur={true}
            gutter={4}
            sameWidth
            class={`${styles.combobox} ${props.size === "small" ? styles.small : ""} ${props.class ?? ""}`}
            itemComponent={(itemProps) => (
                <KobalteCombobox.Item item={itemProps.item} class={styles.item}>
                    <KobalteCombobox.ItemLabel class={styles.label}>
                        {itemProps.item.rawValue.label}
                    </KobalteCombobox.ItemLabel>
                    <KobalteCombobox.ItemIndicator class={styles.indicator}>
                        <Check size={iconSize()} />
                    </KobalteCombobox.ItemIndicator>
                </KobalteCombobox.Item>
            )}
        >
            <KobalteCombobox.Control>
                <KobalteCombobox.Trigger class={styles.trigger}>
                    <Show when={displayValue()}>
                        <span class={styles["trigger-value"]}>{displayValue()}</span>
                    </Show>
                    <Show when={!displayValue()}>
                        <span class={styles.placeholder}>{props.placeholder}</span>
                    </Show>
                    <KobalteCombobox.Icon class={styles["trigger-icon"]}>
                        <ChevronDown size={iconSize()} />
                    </KobalteCombobox.Icon>
                </KobalteCombobox.Trigger>
            </KobalteCombobox.Control>
            <KobalteCombobox.Content class={styles.content}>
                <KobalteCombobox.Input
                    class={styles["search-input"]}
                    placeholder={props.inputPlaceholder ?? "Type..."}
                    autofocus
                />
                <KobalteCombobox.Listbox />
            </KobalteCombobox.Content>
        </KobalteCombobox>
    );
}
