import type { JSX } from "solid-js";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function StaticLayoutDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="StaticLayoutDemo">
                <h2>StaticLayout</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    A top-level page layout that renders the sidebar and a content area side by side. The sidebar is
                    sticky and the content area takes the remaining width.
                </p>

                <section data-label="Usage">
                    <h3>Usage</h3>
                    <p style={{ "margin-bottom": "1rem" }}>
                        StaticLayout is used as the outermost wrapper for pages that need the application sidebar. It
                        accepts children which are rendered in the content area.
                    </p>
                    <pre
                        style={{
                            background: "var(--muted)",
                            padding: "1rem",
                            "border-radius": "0.5rem",
                            overflow: "auto",
                        }}
                    >
                        {`<StaticLayout>
  <div>Your page content here</div>
</StaticLayout>`}
                    </pre>
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="Props">
                    <h3>Props</h3>
                    <ul style={{ "padding-left": "1.5rem" }}>
                        <li>
                            <strong>children</strong> — Content rendered in the main area
                        </li>
                        <li>
                            <strong>class</strong> — Optional CSS class for the root element
                        </li>
                    </ul>
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="Note">
                    <h3>Note</h3>
                    <p>
                        This demo page itself uses <code>UiLayout</code> instead of <code>StaticLayout</code> to avoid
                        nesting sidebars. StaticLayout renders the full application Sidebar component and is meant to be
                        used as the top-level route wrapper.
                    </p>
                </section>
            </div>
        </UiLayout>
    );
}
