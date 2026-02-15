import DOMPurify from "dompurify";
import { Marked } from "marked";
import type { JSX } from "solid-js";
import styles from "./Markdown.module.css";

type Props = {
    children: string | undefined;
    size?: "inherit" | "small" | "xsmall";
    class?: string;
};

const marked = new Marked({
    gfm: true,
    breaks: true,
});

/**
 * Markdown renderer using `marked` (GFM) + DOMPurify sanitization.
 * Supports headings, lists, tables, code blocks, bold, italic, links, etc.
 * Strips unknown XML/HTML-like tags (e.g. <antThinking>, <system-reminder>)
 * before rendering so they never appear to the user.
 */
export function Markdown(props: Props): JSX.Element {
    const html = () => {
        if (!props.children) return "";
        const cleaned = stripXmlTags(props.children);
        const raw = marked.parse(cleaned) as string;
        return DOMPurify.sanitize(raw);
    };

    const sizeClass = () => {
        if (props.size === "small") return styles.small;
        if (props.size === "xsmall") return styles.xsmall;
        return "";
    };

    return <div class={`${styles.markdown} ${sizeClass()} ${props.class ?? ""}`} innerHTML={html()} />;
}

/**
 * Strip XML-like tags that are not standard HTML/markdown.
 * This removes tags like <antThinking>, </antThinking>, <system-reminder>, etc.
 * while preserving standard markdown content.
 */
function stripXmlTags(text: string): string {
    // Remove matched pairs first (e.g. <antThinking>...</antThinking>)
    let result = text.replace(/<(antThinking|ant_thinking)[^>]*>[\s\S]*?<\/\1>/gi, "");
    // Remove any remaining self-closing or opening/closing non-HTML tags
    // Preserve standard HTML tags by only stripping known non-standard ones
    result = result.replace(/<\/?(antThinking|ant_thinking|system-reminder|archestra-[a-z-]+)[^>]*>/gi, "");
    return result.trim();
}
