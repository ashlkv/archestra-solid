import { createSignal, type JSX, Show } from "solid-js";
import { Check, Copy } from "@/components/icons";
import { Button } from "./Button";
import styles from "./CopyButton.module.css";

type Props = {
    text: string;
    label?: string;
    class?: string;
    disabled?: boolean;
};

export function CopyButton(props: Props): JSX.Element {
    const [copied, setCopied] = createSignal(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(props.text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const textArea = document.createElement("textarea");
            textArea.value = props.text;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand("copy");
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (exception) {
                console.error("Failed to copy:", exception);
            }
            document.body.removeChild(textArea);
        }
    };

    return (
        <Button
            variant="ghost"
            size={props.label ? "small" : "icon"}
            class={`${styles.button} ${props.class ?? ""}`}
            tooltip={copied() ? "Copied!" : "Copy to clipboard"}
            onClick={handleCopy}
            disabled={props.disabled}
        >
            <Show when={copied()}>
                <Check size={14} class={styles.check} />
            </Show>
            <Show when={!copied()}>
                <Copy size={14} />
            </Show>
            <Show when={props.label}>
                <span class={styles.label}>{copied() ? "Copied!" : props.label}</span>
            </Show>
        </Button>
    );
}
