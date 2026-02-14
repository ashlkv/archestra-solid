import type { JSX } from "solid-js";
import styles from "./Markdown.module.css";

type Props = {
    children: string | undefined;
    class?: string;
};

/**
 * Simple markdown renderer for instructions and descriptions.
 * Supports: **bold**, `code`, [links](url), line breaks.
 */
export function Markdown(props: Props): JSX.Element {
    const html = () => {
        if (!props.children) return "";
        return parseMarkdown(props.children);
    };

    return (
        <div
            class={`${styles.markdown} ${props.class ?? ""}`}
            innerHTML={html()}
        />
    );
}

function parseMarkdown(text: string): string {
    let result = escapeHtml(text);

    // Convert markdown line breaks (two+ newlines = paragraph break, single newline = <br>)
    result = result
        .split(/\n{2,}/)
        .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`)
        .join("");

    // **bold** or __bold__
    result = result.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    result = result.replace(/__(.+?)__/g, "<strong>$1</strong>");

    // `code`
    result = result.replace(/`([^`]+)`/g, "<code>$1</code>");

    // [text](url)
    result = result.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    return result;
}

function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
}
