import type { JSX } from "solid-js";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function FixedLayoutDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="FixedLayoutDemo">
                <h2>FixedLayout</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    The root layout component that displays a sidebar and main content area. It automatically hides the
                    sidebar on /ui routes.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Description">
                        <h3>How it works</h3>
                        <div
                            style={{
                                padding: "1rem",
                                background: "var(--muted)",
                                "border-radius": "0.5rem",
                                display: "flex",
                                "flex-direction": "column",
                                gap: "0.75rem",
                            }}
                        >
                            <p>FixedLayout wraps the entire application and provides:</p>
                            <ul style={{ "padding-left": "1.5rem" }}>
                                <li>
                                    A <strong>Sidebar</strong> component on the left
                                </li>
                                <li>
                                    A <strong>main</strong> content area that fills the remaining space
                                </li>
                                <li>
                                    Automatic sidebar hiding for <code>/ui</code> routes
                                </li>
                                <li>
                                    An optional <code>class</code> prop for custom styling on the main element
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section data-label="Usage example">
                        <h3>Usage</h3>
                        <pre
                            style={{
                                padding: "1rem",
                                background: "var(--muted)",
                                "border-radius": "0.5rem",
                                overflow: "auto",
                            }}
                        >
                            {`<FixedLayout>
  <PageHeader title="My page" />
  <div>Page content goes here</div>
</FixedLayout>`}
                        </pre>
                    </section>

                    <section data-label="Props">
                        <h3>Props</h3>
                        <table
                            style={{
                                width: "100%",
                                "border-collapse": "collapse",
                            }}
                        >
                            <thead>
                                <tr>
                                    <th
                                        style={{
                                            "text-align": "left",
                                            padding: "0.5rem",
                                            "border-bottom": "1px solid var(--border)",
                                        }}
                                    >
                                        Prop
                                    </th>
                                    <th
                                        style={{
                                            "text-align": "left",
                                            padding: "0.5rem",
                                            "border-bottom": "1px solid var(--border)",
                                        }}
                                    >
                                        Type
                                    </th>
                                    <th
                                        style={{
                                            "text-align": "left",
                                            padding: "0.5rem",
                                            "border-bottom": "1px solid var(--border)",
                                        }}
                                    >
                                        Description
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: "0.5rem", "border-bottom": "1px solid var(--border)" }}>
                                        <code>children</code>
                                    </td>
                                    <td style={{ padding: "0.5rem", "border-bottom": "1px solid var(--border)" }}>
                                        <code>JSX.Element</code>
                                    </td>
                                    <td style={{ padding: "0.5rem", "border-bottom": "1px solid var(--border)" }}>
                                        Content to render in the main area
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: "0.5rem", "border-bottom": "1px solid var(--border)" }}>
                                        <code>class</code>
                                    </td>
                                    <td style={{ padding: "0.5rem", "border-bottom": "1px solid var(--border)" }}>
                                        <code>string</code>
                                    </td>
                                    <td style={{ padding: "0.5rem", "border-bottom": "1px solid var(--border)" }}>
                                        Optional CSS class for the main element
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
