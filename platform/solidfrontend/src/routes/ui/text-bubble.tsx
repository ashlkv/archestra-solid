import type { JSX } from "solid-js";
import { UiLayout } from "@/components/ui-demo/UiLayout";
import { TextBubble } from "@/components/primitives/TextBubble";

const SAMPLE_MARKDOWN = `Here is a **bold** statement and some \`inline code\`.

- First item
- Second item with *emphasis*

\`\`\`js
const greeting = "Hello, world!";
console.log(greeting);
\`\`\`
`;

export default function TextBubbleDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="TextBubbleDemo">
                <h2>TextBubble</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    A chat-style bubble that renders Markdown content. Supports three variants (agent, user, system) and
                    three sizes (inherit, small, xsmall).
                </p>

                <section data-label="Variants">
                    <h3>Variants</h3>
                    <div style={{ display: "flex", "flex-direction": "column", gap: "1rem" }}>
                        <div data-label="Agent variant">
                            <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.25rem" }}>
                                agent (default)
                            </p>
                            <TextBubble
                                variant="agent"
                                text="I can help you configure your MCP server. Let me check the available tools."
                            />
                        </div>
                        <div data-label="User variant">
                            <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.25rem" }}>user</p>
                            <TextBubble
                                variant="user"
                                text="Can you list all the tools assigned to my profile?"
                            />
                        </div>
                        <div data-label="System variant">
                            <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.25rem" }}>system</p>
                            <TextBubble
                                variant="system"
                                text="Tool invocation policy updated. The new rules will take effect immediately."
                            />
                        </div>
                    </div>
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="Sizes">
                    <h3>Sizes</h3>
                    <div style={{ display: "flex", "flex-direction": "column", gap: "1rem" }}>
                        <div data-label="Inherit size">
                            <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.25rem" }}>inherit</p>
                            <TextBubble size="inherit" text="This text inherits the parent font size." />
                        </div>
                        <div data-label="Small size">
                            <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.25rem" }}>
                                small (default)
                            </p>
                            <TextBubble size="small" text="This text uses the small size." />
                        </div>
                        <div data-label="Xsmall size">
                            <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.25rem" }}>xsmall</p>
                            <TextBubble size="xsmall" text="This text uses the extra-small size." />
                        </div>
                    </div>
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="Markdown content">
                    <h3>Markdown content</h3>
                    <div style={{ display: "flex", "flex-direction": "column", gap: "1rem" }}>
                        <TextBubble variant="agent" text={SAMPLE_MARKDOWN} />
                        <TextBubble variant="user" text="Thanks! Can you also show me the **policy** for `fetch-weather`?" />
                    </div>
                </section>
            </div>
        </UiLayout>
    );
}
