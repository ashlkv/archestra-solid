import { RadioGroup as KobalteRadioGroup } from "@kobalte/core/radio-group";
import { For, type JSX } from "solid-js";
import styles from "./RadioGroup.module.css";

type Option = {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
};

export function RadioGroup(props: {
    value?: string;
    onChange?: (value: string) => void;
    options: Option[];
    disabled?: boolean;
    class?: string;
}): JSX.Element {
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
                        <KobalteRadioGroup.ItemLabel class={styles.label}>{option.label}</KobalteRadioGroup.ItemLabel>
                    </KobalteRadioGroup.Item>
                )}
            </For>
        </KobalteRadioGroup>
    );
}

export function RadioGroupCustom(props: {
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    class?: string;
    children: JSX.Element;
}): JSX.Element {
    return (
        <KobalteRadioGroup
            value={props.value}
            onChange={props.onChange}
            disabled={props.disabled}
            class={`${styles.root} ${props.class ?? ""}`}
        >
            {props.children}
        </KobalteRadioGroup>
    );
}

export function RadioGroupItem(props: {
    value: string;
    disabled?: boolean;
    class?: string;
    children: JSX.Element;
}): JSX.Element {
    return (
        <KobalteRadioGroup.Item value={props.value} class={`${styles.item} ${props.class ?? ""}`} disabled={props.disabled}>
            <KobalteRadioGroup.ItemInput />
            <KobalteRadioGroup.ItemControl class={styles.control}>
                <KobalteRadioGroup.ItemIndicator class={styles.indicator} />
            </KobalteRadioGroup.ItemControl>
            <KobalteRadioGroup.ItemLabel class={styles.label}>{props.children}</KobalteRadioGroup.ItemLabel>
        </KobalteRadioGroup.Item>
    );
}
