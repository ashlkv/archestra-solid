import { Select as KobalteSelect } from "@kobalte/core/select";
import { Check, ChevronDown } from "lucide-solid";
import { Show, type JSX } from "solid-js";
import { Spinner } from "./Spinner";
import styles from "./Select.module.css";

interface Option {
    value: string;
    label: string;
}

interface Props {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    disabled?: boolean;
    loading?: boolean;
    class?: string;
}

export function Select(props: Props): JSX.Element {
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
                <KobalteSelect.Item item={itemProps.item} class={styles.item}>
                    <KobalteSelect.ItemLabel class={styles.label}>
                        {itemProps.item.rawValue.label}
                    </KobalteSelect.ItemLabel>
                    <KobalteSelect.ItemIndicator class={styles.indicator}>
                        <Check size={14} />
                    </KobalteSelect.ItemIndicator>
                </KobalteSelect.Item>
            )}
        >
            <KobalteSelect.Trigger
                class={`${styles.trigger} ${props.class ?? ""}`}
            >
                <KobalteSelect.Value<Option>>
                    {(state) => state.selectedOption().label}
                </KobalteSelect.Value>
                <KobalteSelect.Icon class={styles.icon}>
                    <Show when={props.loading} fallback={<ChevronDown size={16} />}>
                        <Spinner size={14} />
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
