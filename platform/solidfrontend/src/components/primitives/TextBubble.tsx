import type { JSX } from "solid-js";
import { Markdown } from "./Markdown";
import styles from "./TextBubble.module.css";

interface Props {
    text: string;
    variant?: "agent" | "user" | "system";
    size?: "inherit" | "small" | "xsmall";
    class?: string;
}

export function TextBubble(props: Props): JSX.Element {
    const variantClass = () => {
        if (props.variant === "user") return styles.user;
        if (props.variant === "system") return styles.system;
        return styles.agent;
    };

    return (
        <div class={`${styles.textBubble} ${variantClass()} ${props.class ?? ""}`}>
            <Markdown size={props.size ?? "small"}>{props.text}</Markdown>
        </div>
    );
}
