import { createSignal, type JSX } from "solid-js";
import { Pagination } from "@/components/common/Pagination";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function PaginationLogsDemo(): JSX.Element {
    const [page, setPage] = createSignal(0);

    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "800px", margin: "0 auto" }} data-label="PaginationLogsDemo">
                <h1>Pagination (logs)</h1>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Page navigation with "Showing X to Y of Z results" summary. Pages are zero-indexed internally.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Interactive pagination">
                        <h3 style={{ "margin-bottom": "0.5rem" }}>Interactive (247 results, 25 per page)</h3>
                        <div
                            style={{
                                border: "1px solid var(--border)",
                                "border-radius": "var(--radius)",
                                padding: "0 1rem",
                            }}
                        >
                            <Pagination page={page()} pageSize={25} total={247} onPageChange={setPage} />
                        </div>
                        <p style={{ color: "var(--muted-foreground)", "margin-top": "0.5rem" }}>
                            Current page index: {page()}
                        </p>
                    </section>

                    <section data-label="Single page">
                        <h3 style={{ "margin-bottom": "0.5rem" }}>Single page (fewer results than page size)</h3>
                        <div
                            style={{
                                border: "1px solid var(--border)",
                                "border-radius": "var(--radius)",
                                padding: "0 1rem",
                            }}
                        >
                            <Pagination page={0} pageSize={25} total={12} onPageChange={() => {}} />
                        </div>
                    </section>

                    <section data-label="Empty results">
                        <h3 style={{ "margin-bottom": "0.5rem" }}>Empty results</h3>
                        <div
                            style={{
                                border: "1px solid var(--border)",
                                "border-radius": "var(--radius)",
                                padding: "0 1rem",
                            }}
                        >
                            <Pagination page={0} pageSize={25} total={0} onPageChange={() => {}} />
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
