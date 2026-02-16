import type { JSX } from "solid-js";
import { Pagination as PaginationPrimitive } from "@/components/primitives/Pagination";

export function Pagination(props: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
}): JSX.Element {
    const totalPages = () => Math.ceil(props.total / props.pageSize);
    const from = () => (props.total === 0 ? 0 : props.page * props.pageSize + 1);
    const to = () => Math.min((props.page + 1) * props.pageSize, props.total);

    return (
        <div
            data-label="Pagination"
            style={{
                display: "flex",
                "align-items": "center",
                "justify-content": "space-between",
                padding: "0.75rem 0",
            }}
        >
            <span style={{ "font-size": "var(--font-size-small)", color: "var(--muted-foreground)" }}>
                {totalPages() <= 1
                    ? `Showing all ${props.total} results`
                    : `Showing ${from()} to ${to()} of ${props.total} results`}
            </span>
            <PaginationPrimitive
                count={totalPages()}
                page={props.page + 1}
                onPageChange={(p) => props.onPageChange(p - 1)}
                fixedItems
            />
        </div>
    );
}
