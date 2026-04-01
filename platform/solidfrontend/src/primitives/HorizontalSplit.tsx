import type { JSX, ParentProps } from "solid-js";
import { splitProps } from "solid-js";
import styles from "./HorizontalSplit.module.css";

export function HorizontalSplit(
    props: ParentProps<{ class?: string; rows?: [number, number] } & JSX.HTMLAttributes<HTMLDivElement>>,
): JSX.Element {
    const [local, rest] = splitProps(props, ["class", "rows", "children"]);
    const cssVariables = () => {
        const rows = local.rows ?? [5, 5];
        return { "--split": `${rows[0]}fr ${rows[1]}fr` };
    };
    return (
        <div data-label="Horizontal split" class={`${styles["horizontal-split"]} ${local.class ?? ""}`} style={cssVariables()} {...rest}>
            {local.children}
        </div>
    );
}
