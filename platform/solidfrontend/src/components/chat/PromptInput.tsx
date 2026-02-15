import type { ChatStatus } from "ai";
import { type JSX, Show } from "solid-js";
import { Send, Square } from "@/components/icons";
import { Button } from "@/components/primitives/Button";
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
                        <Button variant="outline" size="small" onClick={() => props.onStop?.()} data-label="Stop">
                            <Square size={16} />
                        </Button>
                    </Show>
                    <Show when={!isActive()}>
                        <Button
                            variant="default"
                            size="small"
                            onClick={submitMessage}
                            disabled={props.disabled}
                            data-label="Send"
                        >
                            <Send size={16} />
                        </Button>
                    </Show>
                </div>
            </div>
        </div>
    );
}
