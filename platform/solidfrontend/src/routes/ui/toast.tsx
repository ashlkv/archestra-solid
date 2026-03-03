import type { JSX } from "solid-js";
import { UiLayout } from "@/components/ui-demo/UiLayout";
import { Button } from "@/components/primitives/Button";
import { showToast, showError } from "@/components/primitives/Toast";

export default function ToastDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="ToastDemo">
                <h2>Toast</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Notification toasts via Kobalte. Supports a default and destructive variant. Use{" "}
                    <code>showToast</code> and <code>showError</code> to trigger programmatically.
                </p>

                <section data-label="Default variant">
                    <h3>Default variant</h3>
                    <div style={{ display: "flex", gap: "0.5rem", "flex-wrap": "wrap" }}>
                        <Button onClick={() => showToast({ title: "Settings saved" })} data-label="Default toast">
                            Show default toast
                        </Button>
                        <Button
                            onClick={() => showToast({ title: "MCP server started successfully" })}
                            data-label="Success toast"
                        >
                            Show success toast
                        </Button>
                    </div>
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="Destructive variant">
                    <h3>Destructive variant</h3>
                    <div style={{ display: "flex", gap: "0.5rem", "flex-wrap": "wrap" }}>
                        <Button
                            variant="destructive"
                            onClick={() => showToast({ title: "Connection lost", variant: "destructive" })}
                            data-label="Destructive toast"
                        >
                            Show destructive toast
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => showError("Failed to save configuration")}
                            data-label="Error toast"
                        >
                            Show error (shorthand)
                        </Button>
                    </div>
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="Multiple toasts">
                    <h3>Multiple toasts</h3>
                    <Button
                        variant="outline"
                        onClick={() => {
                            showToast({ title: "First notification" });
                            showToast({ title: "Second notification" });
                            showError("Third notification (error)");
                        }}
                        data-label="Multiple toasts"
                    >
                        Show three toasts at once
                    </Button>
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="API reference">
                    <h3>API</h3>
                    <pre
                        style={{
                            background: "var(--muted)",
                            padding: "1rem",
                            "border-radius": "0.5rem",
                            overflow: "auto",
                        }}
                    >
                        {`showToast({ title: string, variant?: "default" | "destructive" })
showError(title: string)  // shorthand for destructive variant`}
                    </pre>
                </section>
            </div>
        </UiLayout>
    );
}
