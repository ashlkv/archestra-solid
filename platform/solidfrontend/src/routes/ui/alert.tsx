import type { JSX } from "solid-js";
import { Alert } from "@/components/primitives/Alert";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function AlertDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="AlertDemo">
                <h2>Alert</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Displays a callout message to the user. Supports default and destructive variants.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Default variant">
                        <h3>Default variant</h3>
                        <div style={{ display: "flex", "flex-direction": "column", gap: "1rem", "margin-top": "0.5rem" }}>
                            <Alert title="Heads up">
                                You can add components to your app using the CLI.
                            </Alert>
                            <Alert title="Title only" />
                            <Alert>Description only, without a title.</Alert>
                        </div>
                    </section>

                    <section data-label="Destructive variant">
                        <h3>Destructive variant</h3>
                        <div style={{ display: "flex", "flex-direction": "column", gap: "1rem", "margin-top": "0.5rem" }}>
                            <Alert variant="destructive" title="Error">
                                Your session has expired. Please log in again.
                            </Alert>
                            <Alert variant="destructive" title="Destructive title only" />
                            <Alert variant="destructive">Destructive description only.</Alert>
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
