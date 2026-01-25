import type { JSX, ParentProps } from "solid-js";
import styles from "./Table.module.css";

interface TableProps extends ParentProps {
    class?: string;
}

export function Table(props: TableProps): JSX.Element {
    return (
        <table class={`${styles.table} ${props.class ?? ""}`}>
            {props.children}
        </table>
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

export function TableHeaderCell(props: ParentProps): JSX.Element {
    return <th class={styles.headerCell}>{props.children}</th>;
}

export function TableCell(props: ParentProps): JSX.Element {
    return <td class={styles.cell}>{props.children}</td>;
}
