import type { JSX } from "solid-js";

export function Count(props: { count: number; total: number }): JSX.Element {
    const label = () => {
        if (props.count === 0) return "None";
        if (props.count === props.total) return `All ${props.total}`;
        return `${props.count}/${props.total}`;
    };

    return <span>{label()}</span>;
}
