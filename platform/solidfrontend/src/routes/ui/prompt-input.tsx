import type { ChatStatus } from "ai";
import { createSignal, type JSX } from "solid-js";
import { PromptInput } from "@/components/chat/PromptInput";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function PromptInputDemo(): JSX.Element {
    const [status, setStatus] = createSignal<ChatStatus>("ready");

    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "800px", margin: "0 auto" }} data-label="PromptInputDemo">
                <h2>Prompt input</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Chat input with auto-resizing textarea, submit/stop buttons, and status-aware behavior.
                </p>
                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Interactive">
                        <h3>Interactive</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.75rem" }}>
                            Toggle status to see how the input responds. Current status:{" "}
                            <Badge variant="info">{status()}</Badge>
                        </p>
                        <div style={{ display: "flex", gap: "0.5rem", "margin-bottom": "1rem" }}>
                            <Button
                                variant={status() === "ready" ? "default" : "outline"}
                                size="small"
                                onClick={() => setStatus("ready")}
                            >
                                Ready
                            </Button>
                            <Button
                                variant={status() === "streaming" ? "default" : "outline"}
                                size="small"
                                onClick={() => setStatus("streaming")}
                            >
                                Streaming
                            </Button>
                            <Button
                                variant={status() === "submitted" ? "default" : "outline"}
                                size="small"
                                onClick={() => setStatus("submitted")}
                            >
                                Submitted
                            </Button>
                        </div>
                        <PromptInput
                            onSubmit={(text) => console.log("Submitted:", text)}
                            onStop={() => {
                                console.log("Stopped");
                                setStatus("ready");
                            }}
                            status={status()}
                        />
                    </section>

                    <section data-label="Idle state">
                        <h3>Idle (ready)</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.75rem" }}>
                            Default state, ready to accept input with the send button.
                        </p>
                        <PromptInput
                            onSubmit={(text) => console.log("Submitted:", text)}
                            status="ready"
                            placeholder="Ask anything..."
                        />
                    </section>

                    <section data-label="Streaming state">
                        <h3>Streaming</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.75rem" }}>
                            Textarea is disabled and shows a stop button instead of send.
                        </p>
                        <PromptInput
                            onSubmit={(text) => console.log("Submitted:", text)}
                            onStop={() => console.log("Stopped")}
                            status="streaming"
                        />
                    </section>

                    <section data-label="Disabled state">
                        <h3>Disabled</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.75rem" }}>
                            Input and button are both disabled.
                        </p>
                        <PromptInput
                            onSubmit={(text) => console.log("Submitted:", text)}
                            status="ready"
                            disabled
                            placeholder="Select a profile to start chatting..."
                        />
                    </section>

                    <section data-label="With header and footer">
                        <h3>With header and footer content</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.75rem" }}>
                            Slots for header content above the textarea and footer content beside the send button.
                        </p>
                        <PromptInput
                            onSubmit={(text) => console.log("Submitted:", text)}
                            status="ready"
                            headerContent={
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <Badge variant="success">GPT-4o</Badge>
                                    <Badge variant="muted">3 tools</Badge>
                                </div>
                            }
                            footerLeft={
                                <span style={{ "font-size": "0.75rem", color: "var(--muted-foreground)" }}>
                                    Shift+Enter for new line
                                </span>
                            }
                        />
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
