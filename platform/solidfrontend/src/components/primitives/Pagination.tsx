import { Pagination as KobaltePagination } from "@kobalte/core/pagination";
import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { ChevronLeft, ChevronRight, Ellipsis } from "@/components/icons";
import styles from "./Pagination.module.css";

type PaginationProps = {
    /** Total number of pages. */
    count: number;
    /** Current page (1-indexed). Controlled. */
    page?: number;
    /** Default page when uncontrolled (1-indexed). */
    defaultPage?: number;
    /** Called when the page changes. */
    onPageChange?: (page: number) => void;
    /** Number of sibling pages around current. Default 1. */
    siblingCount?: number;
    /** Whether to always show first/last page. */
    showFirst?: boolean;
    showLast?: boolean;
    /** Fix total item count to avoid layout shift. */
    fixedItems?: boolean | "no-ellipsis";
    /** Whether pagination is disabled. */
    disabled?: boolean;
    class?: string;
};

export function Pagination(props: PaginationProps): JSX.Element {
    const [local, rest] = splitProps(props, [
        "count",
        "page",
        "defaultPage",
        "onPageChange",
        "siblingCount",
        "showFirst",
        "showLast",
        "fixedItems",
        "disabled",
        "class",
    ]);

    return (
        <KobaltePagination
            count={local.count}
            page={local.page}
            defaultPage={local.defaultPage}
            onPageChange={local.onPageChange}
            siblingCount={local.siblingCount ?? 1}
            showFirst={local.showFirst}
            showLast={local.showLast}
            fixedItems={local.fixedItems}
            disabled={local.disabled}
            class={`${styles.pagination} ${local.class ?? ""}`}
            itemComponent={(itemProps) => (
                <KobaltePagination.Item page={itemProps.page} class={styles.item}>
                    {itemProps.page}
                </KobaltePagination.Item>
            )}
            ellipsisComponent={() => (
                <KobaltePagination.Ellipsis class={styles.ellipsis}>
                    <Ellipsis />
                </KobaltePagination.Ellipsis>
            )}
        >
            <div class={styles.content}>
                <KobaltePagination.Previous class={styles["nav-button"]}>
                    <ChevronLeft style={{ width: "14px", height: "14px" }} />
                    <span class={styles["nav-button-label"]}>Previous</span>
                </KobaltePagination.Previous>
                <KobaltePagination.Items />
                <KobaltePagination.Next class={styles["nav-button"]}>
                    <span class={styles["nav-button-label"]}>Next</span>
                    <ChevronRight style={{ width: "14px", height: "14px" }} />
                </KobaltePagination.Next>
            </div>
        </KobaltePagination>
    );
}
