import { createSignal, type JSX } from "solid-js";
import { Pagination } from "@/components/primitives/Pagination";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function PaginationDemo(): JSX.Element {
    const [controlledPage, setControlledPage] = createSignal(3);
    const [fixedPage, setFixedPage] = createSignal(1);

    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="PaginationDemo">
                <h2>Pagination</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Page navigation with previous/next buttons, page numbers, and ellipsis for large ranges.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Default uncontrolled">
                        <h3>Default (uncontrolled)</h3>
                        <Pagination count={10} />
                    </section>

                    <section data-label="Controlled">
                        <h3>Controlled (page {controlledPage()})</h3>
                        <Pagination count={20} page={controlledPage()} onPageChange={setControlledPage} />
                    </section>

                    <section data-label="With default page">
                        <h3>Default page set to 5</h3>
                        <Pagination count={10} defaultPage={5} />
                    </section>

                    <section data-label="Show first and last">
                        <h3>Show first and last</h3>
                        <Pagination count={20} defaultPage={10} showFirst showLast />
                    </section>

                    <section data-label="Sibling count 2">
                        <h3>Sibling count = 2</h3>
                        <Pagination count={20} defaultPage={10} siblingCount={2} />
                    </section>

                    <section data-label="Fixed items">
                        <h3>Fixed items (no layout shift)</h3>
                        <Pagination count={20} page={fixedPage()} onPageChange={setFixedPage} fixedItems />
                    </section>

                    <section data-label="Few pages">
                        <h3>Few pages</h3>
                        <Pagination count={3} />
                    </section>

                    <section data-label="Disabled">
                        <h3>Disabled</h3>
                        <Pagination count={10} defaultPage={4} disabled />
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
