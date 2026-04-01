import type { ChatStatus } from "ai";
import { type JSX, Show } from "solid-js";
import { Square } from "@/icons";
import { Button } from "@/primitives/Button";
import { Kbd } from "@/primitives/Kbd";
import styles from "./PromptInput.module.css";

export function PromptInput(props: {
    onSubmit: (text: string) => void;
    onStop?: () => void;
    status: ChatStatus;
    disabled?: boolean;
    placeholder?: string;
    headerContent?: JSX.Element;
    footerLeft?: JSX.Element;
}): JSX.Element {
    let textareaRef: HTMLTextAreaElement | undefined;

    const isActive = () => props.status === "streaming" || props.status === "submitted";

    const autoResize = () => {
        if (!textareaRef) return;
        textareaRef.style.height = "auto";
        textareaRef.style.height = `${Math.min(textareaRef.scrollHeight, 192)}px`;
    };

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submitMessage();
        }
        if (event.key === "Escape" && isActive()) {
            event.preventDefault();
            props.onStop?.();
        }
    };

    const submitMessage = () => {
        if (!textareaRef) return;
        const text = textareaRef.value.trim();
        if (!text || props.disabled || isActive()) return;
        props.onSubmit(text);
        textareaRef.value = "";
        autoResize();
    };

    return (
        <div class={styles.container} data-label="Prompt input">
            <Show when={props.headerContent}>
                <div class={styles.header}>{props.headerContent}</div>
            </Show>
            <div class={styles["textarea-wrapper"]}>
                <textarea
                    ref={textareaRef}
                    class={styles.textarea}
                    placeholder={props.placeholder ?? "Send a message..."}
                    disabled={props.disabled || isActive()}
                    onKeyDown={onKeyDown}
                    onInput={autoResize}
                    rows={2}
                />
            </div>
            <div class={styles.footer}>
                <div class={styles["footer-left"]}>{props.footerLeft}</div>
                <div class={styles["footer-right"]}>
                    <Show when={isActive()}>
                        <span class={styles.hint}>
                            <Kbd>Esc</Kbd> to stop
                        </span>
                    </Show>
                    <Show when={!isActive()}>
                        <span class={styles.hint}>
                            <Kbd>Enter</Kbd> to submit
                        </span>
                    </Show>
                </div>
            </div>
        </div>
    );
}
