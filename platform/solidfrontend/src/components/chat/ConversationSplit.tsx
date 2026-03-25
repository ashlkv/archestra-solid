import type { JSX, ParentProps } from "solid-js";
import { splitProps } from "solid-js";
import { HorizontalSplit } from "@/components/primitives/HorizontalSplit";
import styles from "./ConversationSplit.module.css";

export function ConversationSplit(
    props: ParentProps<{ class?: string; } & JSX.HTMLAttributes<HTMLDivElement>>,
): JSX.Element {
    const [local, rest] = splitProps(props, ["class", "children"]);
    return (
        <HorizontalSplit class={`${styles["conversation-split"]} ${local.class ?? ""}`} {...rest}>
            {local.children}
        </HorizontalSplit>
    );
}
