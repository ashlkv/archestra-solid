import { type JSX, splitProps } from "solid-js";
import styles from "./Table.module.css";

export function Table(props: JSX.IntrinsicElements["table"]): JSX.Element {
    return <table {...props} class={`${styles.table} ${props.class ?? ""}`} />;
}

export function TableHead(props: JSX.IntrinsicElements["thead"]): JSX.Element {
    return <thead {...props} class={`${styles.head} ${props.class ?? ""}`} />;
}

export function TableBody(props: JSX.IntrinsicElements["tbody"]): JSX.Element {
    return <tbody {...props} class={`${styles.body} ${props.class ?? ""}`} />;
}

type TableRowProps = JSX.IntrinsicElements["tr"] & { current?: boolean };

export function TableRow(props: TableRowProps): JSX.Element {
    const [local, rest] = splitProps(props, ["current", "class"]);
    const classes = () =>
        [styles.row, local.current && styles.rowCurrent, rest.onClick && styles.rowClickable, local.class]
            .filter(Boolean)
            .join(" ");
    return <tr {...rest} class={classes()} />;
}

export function TableHeaderCell(props: JSX.IntrinsicElements["th"]): JSX.Element {
    return <th {...props} class={`${styles.headerCell} ${props.class ?? ""}`} />;
}

export function TableCell(props: JSX.IntrinsicElements["td"]): JSX.Element {
    const [local, rest] = splitProps(props, ["children", "class"]);
    return (
        <td {...rest} class={`${styles.cell} ${local.class ?? ""}`}>
            <div class={styles.cellContent}>{local.children}</div>
        </td>
    );
}
