import type { JSX, ParentProps } from "solid-js";
import styles from "./Split.module.css";
import { mergeProps } from 'solid-js';

export function Split(props: ParentProps<{ class?: string, columns?: [number, number] }>): JSX.Element {
    const cssVariables = () => {
        const columns = props.columns || [3, 7];
        return {'--columns': `${columns[0]}fr ${columns[1]}fr`};
    }
    return (
        <div class={`${styles.split} ${props.class ?? ""}`} style={cssVariables()} data-label="Split">
            {props.children}
        </div>
    );
}
