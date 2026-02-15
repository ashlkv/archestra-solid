import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { type JSX, onCleanup } from "solid-js";
import { readonlyJsonExtensions } from "./codemirror-extensions";
import styles from "./JsonHighlight.module.css";

export function JsonHighlight(props: { code: string; lineNumbers?: boolean }): JSX.Element {
    let editorView: EditorView | undefined;

    const createEditor = (el: HTMLDivElement) => {
        editorView = new EditorView({
            state: EditorState.create({
                doc: props.code,
                extensions: readonlyJsonExtensions({ lineNumbers: props.lineNumbers }),
            }),
            parent: el,
        });
    };

    onCleanup(() => {
        editorView?.destroy();
    });

    return <div class={styles.jsonHighlight} ref={createEditor} />;
}
