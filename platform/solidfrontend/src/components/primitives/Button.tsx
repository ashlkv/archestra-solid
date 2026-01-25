import { Button as KobalteButton } from "@kobalte/core/button";
import type { JSX, ParentProps } from "solid-js";
import styles from "./Button.module.css";

interface Props extends ParentProps {
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    onClick?: () => void;
    class?: string;
}

export function Button(props: Props): JSX.Element {
    return (
        <KobalteButton.Root
            type={props.type ?? "button"}
            disabled={props.disabled}
            onClick={props.onClick}
            class={`${styles.button} ${props.class ?? ""}`}
        >
            {props.children}
        </KobalteButton.Root>
    );
}
