import type { JSX, ParentProps } from "solid-js";
import { splitProps } from "solid-js";
import { VerticalSplit } from "@/components/primitives/VerticalSplit";
import styles from "./ChatSplit.module.css";

export function ChatSplit(
    props: ParentProps<{ class?: string; columns?: [number, number, number] } & JSX.HTMLAttributes<HTMLDivElement>>,
): JSX.Element {
    const [local, rest] = splitProps(props, ["class", "columns", "children"]);
    return (
        <VerticalSplit data-label="Chat split" columns={local.columns ?? [6, 4]} class={`${styles["chat-split"]} ${local.class ?? ""}`} {...rest}>
            {local.children}
        </VerticalSplit>
    );
}
