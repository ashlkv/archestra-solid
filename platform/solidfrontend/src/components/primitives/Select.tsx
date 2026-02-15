import { Select as KobalteSelect } from "@kobalte/core/select";
import { type JSX, Show } from "solid-js";
import { Check, ChevronDown } from "@/components/icons";
import styles from "./Select.module.css";
import { Spinner } from "./Spinner";

interface Option {
    value: string;
    label: string;
}

type SelectSize = "inherit" | "small" | "xsmall";

interface Props {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    disabled?: boolean;
    loading?: boolean;
    size?: SelectSize;
    class?: string;
}

export function Select(props: Props): JSX.Element {
    const sizeClass = () => {
        if (props.size === "small") return styles.small;
        if (props.size === "xsmall") return styles.xsmall;
        return "";
    };

    const iconSize = () => {
        if (props.size === "xsmall") return 12;
        if (props.size === "small") return 14;
        return 16;
    };

    return (
        <KobalteSelect
            value={props.options.find((o) => o.value === props.value)}
            onChange={(option) => option && props.onChange(option.value)}
            options={props.options}
            optionValue="value"
            optionTextValue="label"
            placeholder={props.placeholder}
            disabled={props.disabled || props.loading}
            itemComponent={(itemProps) => (
                <KobalteSelect.Item item={itemProps.item} class={`${styles.item} ${sizeClass()}`}>
                    <KobalteSelect.ItemLabel class={styles.label}>
                        {itemProps.item.rawValue.label}
                    </KobalteSelect.ItemLabel>
                    <KobalteSelect.ItemIndicator class={styles.indicator}>
                        <Check size={iconSize()} />
                    </KobalteSelect.ItemIndicator>
                </KobalteSelect.Item>
            )}
        >
            <KobalteSelect.Trigger class={`${styles.trigger} ${sizeClass()} ${props.class ?? ""}`}>
                <KobalteSelect.Value<Option>>{(state) => state.selectedOption().label}</KobalteSelect.Value>
                <KobalteSelect.Icon class={styles.icon}>
                    <Show when={props.loading} fallback={<ChevronDown size={iconSize()} />}>
                        <Spinner size={iconSize()} />
                    </Show>
                </KobalteSelect.Icon>
            </KobalteSelect.Trigger>
            <KobalteSelect.Portal>
                <KobalteSelect.Content class={styles.content}>
                    <KobalteSelect.Listbox />
                </KobalteSelect.Content>
            </KobalteSelect.Portal>
        </KobalteSelect>
    );
}
