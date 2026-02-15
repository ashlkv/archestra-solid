import { json } from "@codemirror/lang-json";
import { MergeView } from "@codemirror/merge";
import { EditorState } from "@codemirror/state";
import { EditorView, lineNumbers } from "@codemirror/view";
import { type JSX, onCleanup, Show } from "solid-js";
import styles from "./JsonDiffViewer.module.css";

export function JsonDiffViewer(props: { original: unknown; modified: unknown }): JSX.Element {
    let containerRef: HTMLDivElement | undefined;
    let mergeViewInstance: MergeView | undefined;

    const originalJson = () => {
        try {
            return JSON.stringify(props.original, null, 2);
        } catch {
            return String(props.original);
        }
    };

    const modifiedJson = () => {
        try {
            return JSON.stringify(props.modified, null, 2);
        } catch {
            return String(props.modified);
        }
    };

    const hasDifferences = () => originalJson() !== modifiedJson();

    const createMergeView = () => {
        if (!containerRef || mergeViewInstance) return;

        const sharedExtensions = [
            json(),
            EditorState.readOnly.of(true),
            EditorView.editable.of(false),
            EditorView.lineWrapping,
            lineNumbers(),
            EditorView.theme({
                "&": { backgroundColor: "var(--muted-background)" },
            }),
        ];

        mergeViewInstance = new MergeView({
            a: {
                doc: originalJson(),
                extensions: sharedExtensions,
            },
            b: {
                doc: modifiedJson(),
                extensions: sharedExtensions,
            },
            parent: containerRef,
            highlightChanges: true,
            gutter: true,
            collapseUnchanged: { margin: 3, minSize: 6 },
        });
    };

    const destroyMergeView = () => {
        if (mergeViewInstance) {
            mergeViewInstance.destroy();
            mergeViewInstance = undefined;
        }
    };

    onCleanup(destroyMergeView);

    return (
        <Show
            when={hasDifferences()}
            fallback={<div class={styles.noDiff}>No differences — the request was not modified.</div>}
        >
            <div class={styles.labels}>
                <div class={styles.label}>Original request</div>
                <div class={styles.label}>Processed request (sent to LLM)</div>
            </div>
            <div
                class={styles.mergeView}
                ref={(el) => {
                    containerRef = el;
                    queueMicrotask(createMergeView);
                }}
            />
        </Show>
    );
}
