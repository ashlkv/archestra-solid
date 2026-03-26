import { Switch as KobalteSwitch } from "@kobalte/core/switch";
import type { JSX } from "solid-js";
import styles from "./Switch.module.css";

export function Switch(props: {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    label?: string;
    class?: string;
}): JSX.Element {
    return (
        <KobalteSwitch
            checked={props.checked}
            onChange={props.onChange}
            disabled={props.disabled}
            class={`${styles.root} ${props.class ?? ""}`}
        >
            <KobalteSwitch.Input />
            <KobalteSwitch.Label class={styles.label}>{props.label}</KobalteSwitch.Label>
            <KobalteSwitch.Control class={styles.control}>
                <KobalteSwitch.Thumb class={styles.thumb} />
            </KobalteSwitch.Control>
        </KobalteSwitch>
    );
}
