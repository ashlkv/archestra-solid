import type { ComponentProps, JSX } from "solid-js";
import { splitProps } from "solid-js";
import styles from "./Input.module.css";

type Props = {
    type?: "text" | "password" | "number" | "email" | "url";
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    mono?: boolean;
    id?: string;
    min?: number;
    max?: number;
    onInput?: (value: string) => void;
    class?: string;
} & Omit<
    ComponentProps<"input">,
    "type" | "value" | "placeholder" | "disabled" | "id" | "min" | "max" | "class" | "onInput"
>;

export function Input(props: Props): JSX.Element {
    const [local, rest] = splitProps(props, [
        "type",
        "value",
        "placeholder",
        "disabled",
        "mono",
        "id",
        "min",
        "max",
        "onInput",
        "class",
    ]);
    const monoClass = () => (local.mono ? styles.mono : "");

    return (
        <input
            type={local.type ?? "text"}
            value={local.value ?? ""}
            placeholder={local.placeholder}
            disabled={local.disabled}
            id={local.id}
            min={local.min}
            max={local.max}
            onInput={(event) => local.onInput?.(event.currentTarget.value)}
            class={`${styles.input} ${monoClass()} ${local.class ?? ""}`}
            {...rest}
        />
    );
}
