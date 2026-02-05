import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import styles from "./Textarea.module.css";

type Props = {
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    mono?: boolean;
    resize?: boolean;
    rows?: number;
    id?: string;
    onInput?: (value: string) => void;
    class?: string;
    ref?: (element: HTMLTextAreaElement) => void;
};

export function Textarea(props: Props): JSX.Element {
    const [local, rest] = splitProps(props, ["value", "placeholder", "disabled", "mono", "resize", "rows", "id", "onInput", "class", "ref"]);
    const monoClass = () => (local.mono ? styles.mono : "");
    const resizeClass = () => (local.resize === false ? styles["no-resize"] : "");

    return (
        <textarea
            ref={local.ref}
            value={local.value ?? ""}
            placeholder={local.placeholder}
            disabled={local.disabled}
            rows={local.rows}
            id={local.id}
            onInput={(event) => local.onInput?.(event.currentTarget.value)}
            class={`${styles.textarea} ${monoClass()} ${resizeClass()} ${local.class ?? ""}`}
            {...rest}
        />
    );
}
