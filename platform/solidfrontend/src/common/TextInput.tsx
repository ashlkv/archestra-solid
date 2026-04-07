import { createEffect, createSignal, onCleanup, type JSX } from "solid-js";
import { EditableText, type EditableTextDoneReason } from "./EditableText";
import { isTouchDevice, shouldWrapTextInput } from "./TextInput.utils";
import styles from "./TextInput.module.css";

export function TextInput(props: {
    value?: string | number;
    size?: "small" | "medium";
    kind?: string;
    format?: "text" | "number";
    direction?: "ltr" | "rtl";
    placeholder?: string;
    rows?: number;
    min?: number;
    max?: number;
    multiline?: boolean;
    disabled?: boolean;
    showMultilineHelper?: boolean;
    onInput?: (value: string) => void;
    onUpdate?: (value: string) => void;
    onBlur?: () => void;
    onDone?: (text: string, reason: EditableTextDoneReason) => void;
}): JSX.Element {
    let wrapperElement: HTMLDivElement | undefined;
    let resizeObserver: ResizeObserver | undefined;

    const [focused, setFocused] = createSignal(false, { name: "focused" });
    const [lineCount, setLineCount] = createSignal(1, { name: "lineCount" });

    const value = () => (props.value !== undefined ? String(props.value) : "");
    const wrap = () => shouldWrapTextInput({ format: props.format, kind: props.kind, multiline: props.multiline });

    createEffect(function trackLineCount() {
        if (wrapperElement && wrap()) {
            const updateLineCount = () => {
                const field = wrapperElement?.querySelector('[data-label="Editable textarea"]') as HTMLTextAreaElement | null;

                if (!field) {
                    setLineCount(1);
                } else {
                    const computedStyle = getComputedStyle(field);
                    const lineHeight = Number.parseFloat(computedStyle.lineHeight);
                    const height = field.offsetHeight;
                    setLineCount(Math.max(1, Math.round(height / lineHeight) || 1));
                }
            };

            updateLineCount();

            if (typeof window !== "undefined" && window.ResizeObserver) {
                resizeObserver?.disconnect();
                resizeObserver = new ResizeObserver(updateLineCount);
                resizeObserver.observe(wrapperElement);
            }
        }
    });

    onCleanup(() => {
        resizeObserver?.disconnect();
    });

    const onWrapperClick = (event: MouseEvent) => {
        if (event.currentTarget === event.target) {
            if (!props.disabled) {
                (wrapperElement?.querySelector("input, textarea") as HTMLElement | null)?.focus();
            }
        }
    };

    const onKeyDown = (event: KeyboardEvent) => {
        const shortcutOrTouch = event.shiftKey || isTouchDevice();

        if (event.key === "Enter" && wrap() && shortcutOrTouch) {
            event.stopPropagation();
        }
    };

    return (
        <div class={styles.field} data-label="Text input">
            <div
                ref={wrapperElement}
                class={`${styles["editable-text-wrapper"]} ${focused() ? styles.focused : ""} ${
                    props.disabled ? styles.disabled : ""
                }`}
                onClick={onWrapperClick}
                onKeyDown={onKeyDown}
                data-label="Text input wrapper"
            >
                <EditableText
                    text={value()}
                    placeholder={props.format === "number" ? "Type a number" : props.placeholder}
                    rows={props.rows}
                    multiline={wrap()}
                    pattern={props.format === "number" ? "[0-9]*" : undefined}
                    disabled={props.disabled}
                    onInput={props.onInput}
                    onUpdate={props.onUpdate}
                    onBlur={() => {
                        setFocused(false);
                        props.onBlur?.();
                    }}
                    onDone={props.onDone}
                    onFocus={() => setFocused(true)}
                    dir={props.direction}
                />
            </div>
            {props.showMultilineHelper && wrap() && lineCount() < 2 && !isTouchDevice() ? (
                <p class={styles.helper}>Shift + Enter to make a line break</p>
            ) : null}
        </div>
    );
}
