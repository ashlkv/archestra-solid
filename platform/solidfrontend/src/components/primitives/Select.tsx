import { Select as KobalteSelect } from "@kobalte/core/select";
import { type JSX, Show } from "solid-js";
import { Check, ChevronDown } from "@/components/icons";
import styles from "./Select.module.css";
import { Spinner } from "./Spinner";

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectOptionGroup {
    label: string;
    options: SelectOption[];
}

type SelectSize = "inherit" | "medium" | "small" | "xsmall";

interface Props {
    value: string;
    onChange: (value: string) => void;
    options?: SelectOption[];
    groups?: SelectOptionGroup[];
    placeholder?: string;
    disabled?: boolean;
    loading?: boolean;
    size?: SelectSize;
    class?: string;
    name?: string;
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

    const allOptions = () =>
        props.groups ? props.groups.flatMap((group) => group.options) : (props.options ?? []);

    return (
        <KobalteSelect
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value={allOptions().find((option) => option.value === props.value)}
            onChange={(option) => option && props.onChange(option.value)}
            options={(props.groups ?? props.options ?? []) as any}
            optionValue="value"
            optionTextValue="label"
            optionGroupChildren={props.groups ? "options" : undefined}
            placeholder={props.placeholder}
            disabled={props.disabled || props.loading}
            name={props.name}
            gutter={4}
            sectionComponent={
                props.groups
                    ? (sectionProps) => (
                          <KobalteSelect.Section>
                              <KobalteSelect.Label class={styles["group-label"]}>
                                  {(sectionProps.section.rawValue as SelectOptionGroup).label}
                              </KobalteSelect.Label>
                          </KobalteSelect.Section>
                      )
                    : undefined
            }
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
            class={styles.select}
        >
            <KobalteSelect.Trigger class={`${styles.trigger} ${sizeClass()} ${props.class ?? ""}`}>
                <KobalteSelect.Value<SelectOption>>{(state) => state.selectedOption().label}</KobalteSelect.Value>
                <KobalteSelect.Icon class={styles.icon}>
                    <Show when={props.loading}>
                        <Spinner size={iconSize()} />
                    </Show>
                    <Show when={!props.loading}>
                        <ChevronDown size={iconSize()} />
                    </Show>
                </KobalteSelect.Icon>
            </KobalteSelect.Trigger>
            <KobalteSelect.Content class={styles.content}>
                <KobalteSelect.Listbox />
            </KobalteSelect.Content>
        </KobalteSelect>
    );
}
