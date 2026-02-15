import { Checkbox as KobalteCheckbox } from "@kobalte/core/checkbox";
import type { JSX, ParentProps } from "solid-js";
import { Show } from "solid-js";
import { Check, Minus } from "@/components/icons";
import styles from "./Checkbox.module.css";

type Props = {
    checked?: boolean;
    indeterminate?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    id?: string;
    class?: string;
};

export function Checkbox(props: Props): JSX.Element {
    return (
        <KobalteCheckbox
            checked={props.checked}
            indeterminate={props.indeterminate}
            onChange={props.onChange}
            disabled={props.disabled}
            class={`${styles.root} ${props.class ?? ""}`}
        >
            <KobalteCheckbox.Input id={props.id} />
            <KobalteCheckbox.Control class={styles.control}>
                <KobalteCheckbox.Indicator class={styles.indicator}>
                    <Show when={props.indeterminate} fallback={<Check size={12} />}>
                        <Minus size={12} />
                    </Show>
                </KobalteCheckbox.Indicator>
            </KobalteCheckbox.Control>
        </KobalteCheckbox>
    );
}

export function CheckboxLabel(props: ParentProps<{ for?: string; class?: string }>): JSX.Element {
    return (
        <KobalteCheckbox.Label class={`${styles.label} ${props.class ?? ""}`}>{props.children}</KobalteCheckbox.Label>
    );
}
