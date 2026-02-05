import { Checkbox as KobalteCheckbox } from "@kobalte/core/checkbox";
import { Check } from "@/components/icons";
import type { JSX, ParentProps } from "solid-js";
import styles from "./Checkbox.module.css";

type Props = {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    id?: string;
    class?: string;
};

export function Checkbox(props: Props): JSX.Element {
    return (
        <KobalteCheckbox
            checked={props.checked}
            onChange={props.onChange}
            disabled={props.disabled}
            class={`${styles.root} ${props.class ?? ""}`}
        >
            <KobalteCheckbox.Input id={props.id} />
            <KobalteCheckbox.Control class={styles.control}>
                <KobalteCheckbox.Indicator class={styles.indicator}>
                    <Check size={12} />
                </KobalteCheckbox.Indicator>
            </KobalteCheckbox.Control>
        </KobalteCheckbox>
    );
}

export function CheckboxLabel(props: ParentProps<{ for?: string; class?: string }>): JSX.Element {
    return (
        <KobalteCheckbox.Label class={`${styles.label} ${props.class ?? ""}`}>
            {props.children}
        </KobalteCheckbox.Label>
    );
}
