import type { JSX } from "solid-js";
import { Show } from "solid-js";
import { FoldVertical, UnfoldVertical } from "@/components/icons";
import { Spinner } from "@/components/primitives/Spinner";
import styles from "./ExpandCollapseButton.module.css";

interface Props {
    expanded: boolean;
    pending?: boolean;
    onClick?: (e: MouseEvent) => void;
    size?: number;
    class?: string;
}

export function ExpandCollapseButton(props: Props): JSX.Element {
    const iconSize = () => props.size ?? 16;
    const iconSizePx = () => `${iconSize()}px`;

    return (
        <button
            type="button"
            class={`${styles.button} ${props.class ?? ""}`}
            onClick={(e) => {
                e.stopPropagation();
                props.onClick?.(e);
            }}
            title={props.pending ? "Loading..." : props.expanded ? "Collapse" : "Expand"}
        >
            <Show when={!props.pending} fallback={<Spinner size={iconSize()} />}>
                <Show
                    when={props.expanded}
                    fallback={<UnfoldVertical style={{ width: iconSizePx(), height: iconSizePx() }} />}
                >
                    <FoldVertical style={{ width: iconSizePx(), height: iconSizePx() }} />
                </Show>
            </Show>
        </button>
    );
}
