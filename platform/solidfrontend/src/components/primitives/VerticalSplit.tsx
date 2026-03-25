import type { JSX, ParentProps } from "solid-js";
import { splitProps } from "solid-js";
import styles from "./VerticalSplit.module.css";

export function VerticalSplit(
    props: ParentProps<{ class?: string; columns?: number[] } & JSX.HTMLAttributes<HTMLDivElement>>,
): JSX.Element {
    const [local, rest] = splitProps(props, ["class", "columns", "children"]);
    const cssVariables = () => {
        const columns = local.columns ?? [5, 5];
        return { "--split": columns.map(c => `${c}fr`).join(' ') };
    };
    return (
        <div data-label="Vertical split" class={`${styles["vertical-split"]} ${local.class ?? ""}`} style={cssVariables()} {...rest}>
            {local.children}
        </div>
    );
}
