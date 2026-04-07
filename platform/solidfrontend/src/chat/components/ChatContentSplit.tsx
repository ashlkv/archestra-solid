import type { JSX, ParentProps } from "solid-js";
import { splitProps } from "solid-js";
import { HorizontalSplit } from "@/primitives/HorizontalSplit";
import styles from "./ChatContentSplit.module.css";

export function ChatContentSplit(
    props: ParentProps<{ class?: string } & JSX.HTMLAttributes<HTMLDivElement>>,
): JSX.Element {
    const [local, rest] = splitProps(props, ["class", "children"]);
    return (
        <HorizontalSplit class={`${styles["chat-content-split"]} ${local.class ?? ""}`} {...rest}>
            {local.children}
        </HorizontalSplit>
    );
}
