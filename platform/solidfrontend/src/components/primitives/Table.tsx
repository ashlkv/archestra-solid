import type { JSX, ParentProps } from "solid-js";
import styles from "./Table.module.css";

interface TableProps extends ParentProps {
    class?: string;
}

export function Table(props: TableProps): JSX.Element {
    return (
        <table class={`${styles.table} ${props.class ?? ""}`}>{props.children}</table>
    );
}

export function TableHead(props: ParentProps): JSX.Element {
    return <thead class={styles.head}>{props.children}</thead>;
}

export function TableBody(props: ParentProps): JSX.Element {
    return <tbody class={styles.body}>{props.children}</tbody>;
}

export function TableRow(props: ParentProps & { class?: string }): JSX.Element {
    return <tr class={`${styles.row} ${props.class ?? ""}`}>{props.children}</tr>;
}

interface CellProps extends ParentProps {
    "data-label"?: string;
}

export function TableHeaderCell(props: CellProps): JSX.Element {
    return (
        <th class={styles.headerCell} data-label={props["data-label"]}>
            {props.children}
        </th>
    );
}

export function TableCell(props: CellProps): JSX.Element {
    return (
        <td class={styles.cell} data-label={props["data-label"]}>
            {props.children}
        </td>
    );
}
