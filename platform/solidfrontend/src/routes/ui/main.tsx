import type { JSX } from "solid-js";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function MainComponentDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="MainComponentDemo">
                <h2>Main</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    A semantic main content wrapper that applies consistent padding and sizing styles. Used as the
                    primary content container within layouts.
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
                            <p>The Main component renders a semantic <code>&lt;main&gt;</code> HTML element with:</p>
                            <ul style={{ "padding-left": "1.5rem" }}>
                                <li>Consistent styling from Main.module.css</li>
                                <li>
                                    An optional <code>class</code> prop for additional custom CSS
                                </li>
                                <li>Pass-through of children as the main page content</li>
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
                            {`import { Main } from "@/components/primitives/Main";

<Main>
  <h1>Page title</h1>
  <p>Page content goes here.</p>
</Main>

// With custom class
<Main class="custom-padding">
  <div>Custom styled content</div>
</Main>`}
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
                                        The main page content
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
                                        Optional additional CSS class
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
