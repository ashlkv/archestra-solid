import type { JSX } from "solid-js";
import { Show } from "solid-js";
import { FoldVertical, UnfoldVertical } from "@/components/icons";
import styles from "./ExpandCollapseButton.module.css";

interface Props {
    expanded: boolean;
    onClick?: (e: MouseEvent) => void;
    size?: number;
    class?: string;
}

export function ExpandCollapseButton(props: Props): JSX.Element {
    const iconSize = () => `${props.size ?? 16}px`;

    return (
        <button
            type="button"
            class={`${styles.button} ${props.class ?? ""}`}
            onClick={(e) => {
                e.stopPropagation();
                props.onClick?.(e);
            }}
            title={props.expanded ? "Collapse" : "Expand"}
        >
            <Show when={props.expanded} fallback={<UnfoldVertical style={{ width: iconSize(), height: iconSize() }} />}>
                <FoldVertical style={{ width: iconSize(), height: iconSize() }} />
            </Show>
        </button>
    );
}
