import { json } from "@codemirror/lang-json";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorState, type Extension } from "@codemirror/state";
import { EditorView, lineNumbers } from "@codemirror/view";
import { tags } from "@lezer/highlight";

const jsonHighlightStyle = HighlightStyle.define([
    { tag: tags.string, color: "oklch(0.55 0.15 145)" }, // green for strings
    { tag: tags.number, color: "oklch(0.55 0.18 250)" }, // blue for numbers
    { tag: tags.bool, color: "oklch(0.55 0.2 310)" }, // purple for booleans
    { tag: tags.null, color: "oklch(0.55 0.1 30)" }, // muted orange for null
    { tag: tags.propertyName, color: "oklch(0.50 0.18 18)" }, // red-ish for keys
    { tag: tags.punctuation, color: "oklch(0.55 0 0)" }, // neutral for braces/brackets
]);

export function readonlyJsonExtensions(): Extension[] {
    return [
        json(),
        syntaxHighlighting(jsonHighlightStyle),
        EditorState.readOnly.of(true),
        EditorView.editable.of(false),
        EditorView.lineWrapping,
        lineNumbers(),
        EditorView.theme({
            "&": { backgroundColor: "var(--muted-background)" },
        }),
    ];
}
