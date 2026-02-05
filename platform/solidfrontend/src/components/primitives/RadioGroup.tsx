import { RadioGroup as KobalteRadioGroup } from "@kobalte/core/radio-group";
import { For, type JSX, type ParentProps } from "solid-js";
import styles from "./RadioGroup.module.css";

type Option = {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
};

type Props = {
    value?: string;
    onChange?: (value: string) => void;
    options: Option[];
    disabled?: boolean;
    class?: string;
};

export function RadioGroup(props: Props): JSX.Element {
    return (
        <KobalteRadioGroup
            value={props.value}
            onChange={props.onChange}
            disabled={props.disabled}
            class={`${styles.root} ${props.class ?? ""}`}
        >
            <For each={props.options}>
                {(option) => (
                    <KobalteRadioGroup.Item value={option.value} class={styles.item} disabled={option.disabled}>
                        <KobalteRadioGroup.ItemInput />
                        <KobalteRadioGroup.ItemControl class={styles.control}>
                            <KobalteRadioGroup.ItemIndicator class={styles.indicator} />
                        </KobalteRadioGroup.ItemControl>
                        <KobalteRadioGroup.ItemLabel class={styles.label}>
                            {option.label}
                        </KobalteRadioGroup.ItemLabel>
                    </KobalteRadioGroup.Item>
                )}
            </For>
        </KobalteRadioGroup>
    );
}
