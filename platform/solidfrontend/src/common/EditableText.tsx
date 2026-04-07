import { Dynamic } from "solid-js/web";
import { createEffect, createSignal, onCleanup, type JSX } from "solid-js";
import { getLineNumberAtPosition, getLineStart } from "./EditableText.utils";
import styles from "./EditableText.module.css";

export type EditableTextDoneReason = "blur" | "save" | "enter";

export type EditableTextApi = {
    focus: () => void;
    isCaretAtFirstLine: () => boolean;
    isCaretAtLastLine: () => boolean;
    getLineStart: (position: number) => number;
};

export function EditableText(props: {
    text?: string;
    editable?: boolean;
    multiline?: boolean;
    placeholder?: string;
    tag?: string;
    dir?: "ltr" | "rtl";
    rows?: number;
    maxlength?: number;
    pattern?: string;
    readonly?: boolean;
    disabled?: boolean;
    class?: string;
    onInput?: (text: string) => void;
    onUpdate?: (text: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onDone?: (text: string, reason: EditableTextDoneReason) => void;
    onDelete?: () => void;
    apiRef?: (api: EditableTextApi) => void;
}): JSX.Element {
    let inputElement: HTMLInputElement | HTMLTextAreaElement | undefined;
    let mirrorElement: HTMLSpanElement | undefined;
    let updateTimeout: number | undefined;

    const [actualText, setActualText] = createSignal(props.text ?? "", { name: "actualText" });
    const [dirty, setDirty] = createSignal(false, { name: "dirty" });

    const editable = () => props.editable ?? true;
    const multiline = () => props.multiline ?? true;
    const tag = () => props.tag ?? "div";
    const displayText = () => actualText() || props.placeholder || "";

    createEffect(function syncTextFromProps() {
        if (props.text !== undefined) {
            const nextText = props.text ?? "";

            if (actualText() !== nextText) {
                setActualText(nextText);
            }
        }
    });

    createEffect(function exposeApiRef() {
        props.apiRef?.({
            focus: () => inputElement?.focus(),
            isCaretAtFirstLine: () => isCaretAtFirstLine(),
            isCaretAtLastLine: () => isCaretAtLastLine(),
            getLineStart: (position: number) => getCurrentLineStart(position),
        });
    });

    onCleanup(() => {
        if (updateTimeout !== undefined) {
            clearTimeout(updateTimeout);
        }
    });

    const emitUpdate = () => {
        if (dirty()) {
            setDirty(false);
            props.onUpdate?.(actualText());
        }
    };

    const scheduleUpdate = () => {
        if (updateTimeout !== undefined) {
            clearTimeout(updateTimeout);
        }

        updateTimeout = window.setTimeout(() => {
            emitUpdate();
        }, 500);
    };

    const onInput = (text: string) => {
        setActualText(text);
        setDirty(true);
        props.onInput?.(text);
        scheduleUpdate();
    };

    const onFocus = () => {
        props.onFocus?.();
    };

    const onBlur = () => {
        props.onBlur?.();
        emitUpdate();
        props.onDone?.(actualText(), "blur");
    };

    const onSave = () => {
        emitUpdate();
        props.onDone?.(actualText(), "save");
    };

    const onEnter = (event: KeyboardEvent) => {
        if (!multiline()) {
            emitUpdate();
            props.onDone?.(actualText(), "enter");
            event.preventDefault();
        } else {
            emitUpdate();
        }
    };

    const onDelete = (event: KeyboardEvent) => {
        if (editable() && !actualText().length) {
            event.preventDefault();
            props.onDelete?.();
        }
    };

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Enter") {
            onEnter(event);
        } else if (event.key === "Backspace" || event.key === "Delete") {
            onDelete(event);
        } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
            event.preventDefault();
            onSave();
        }
    };

    const isCaretAtFirstLine = (): boolean => {
        if (!actualText()) {
            return true;
        } else if (mirrorElement && inputElement) {
            const { line } = getLineNumberAtPosition(mirrorElement, inputElement.selectionStart ?? 0);
            return line === 1;
        } else {
            return false;
        }
    };

    const isCaretAtLastLine = (): boolean => {
        if (!actualText()) {
            return true;
        } else if (mirrorElement && inputElement) {
            const { line, lines } = getLineNumberAtPosition(mirrorElement, inputElement.selectionStart ?? 0);
            return line === lines;
        } else {
            return false;
        }
    };

    const getCurrentLineStart = (position: number): number => {
        if (mirrorElement) {
            return getLineStart(mirrorElement, position);
        } else {
            return 0;
        }
    };

    return (
        <Dynamic
            component={tag()}
            class={`${editable() ? styles["editable-wrapper"] : styles["static-wrapper"]} ${props.class ?? ""} ${
                !actualText() && props.placeholder ? styles.placeholder : ""
            }`}
            data-label="Editable text"
        >
            {editable() ? (
                <>
                    <span
                        ref={mirrorElement}
                        class={`${styles.mirror} ${!multiline() ? styles["single-line"] : ""}`}
                        data-label="Editable text mirror"
                    >
                        {displayText()}
                    </span>
                    {multiline() ? (
                        <textarea
                            ref={(element) => {
                                inputElement = element;
                            }}
                            placeholder={props.placeholder}
                            maxlength={props.maxlength}
                            readOnly={props.readonly}
                            disabled={props.disabled}
                            dir={props.dir}
                            rows={props.rows}
                            role="textbox"
                            spellcheck={false}
                            autocapitalize="off"
                            autocomplete="off"
                            class={styles.textarea}
                            data-label="Editable textarea"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onKeyDown={onKeyDown}
                            onInput={(event) => onInput(event.currentTarget.value)}
                        >
                            {actualText()}
                        </textarea>
                    ) : (
                        <input
                            ref={(element) => {
                                inputElement = element;
                            }}
                            value={actualText()}
                            placeholder={props.placeholder}
                            maxlength={props.maxlength}
                            pattern={props.pattern}
                            readOnly={props.readonly}
                            disabled={props.disabled}
                            dir={props.dir}
                            role="textbox"
                            spellcheck={false}
                            autocapitalize="off"
                            autocomplete="off"
                            class={styles.input}
                            data-label="Editable input"
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onKeyDown={onKeyDown}
                            onInput={(event) => onInput(event.currentTarget.value)}
                        />
                    )}
                </>
            ) : (
                <>
                    <span class={styles["static-text"]} data-label="Static text">
                        {displayText()}
                    </span>
                </>
            )}
        </Dynamic>
    );
}
