import type { JSX } from "solid-js";
import { ChevronLeft, ChevronRight } from "@/components/icons";
import { Button } from "@/components/primitives/Button";

export function Pagination(props: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
}): JSX.Element {
    const totalPages = () => Math.ceil(props.total / props.pageSize);
    const from = () => (props.total === 0 ? 0 : props.page * props.pageSize + 1);
    const to = () => Math.min((props.page + 1) * props.pageSize, props.total);
    const hasPrevious = () => props.page > 0;
    const hasNext = () => props.page < totalPages() - 1;

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
                Showing {from()} to {to()} of {props.total} results
            </span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button
                    variant="outline"
                    size="small"
                    disabled={!hasPrevious()}
                    onClick={() => props.onPageChange(props.page - 1)}
                >
                    <ChevronLeft /> Previous
                </Button>
                <Button
                    variant="outline"
                    size="small"
                    disabled={!hasNext()}
                    onClick={() => props.onPageChange(props.page + 1)}
                >
                    Next <ChevronRight />
                </Button>
            </div>
        </div>
    );
}
