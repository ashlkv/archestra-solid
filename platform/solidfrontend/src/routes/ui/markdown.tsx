import type { JSX } from "solid-js";
import { Markdown } from "@/components/primitives/Markdown";
import { UiLayout } from "@/components/ui-demo/UiLayout";

const BASIC_MARKDOWN = `# Heading 1
## Heading 2
### Heading 3

This is a paragraph with **bold text**, *italic text*, and \`inline code\`.

[A link to example](https://example.com)`;

const LIST_MARKDOWN = `## Lists

### Unordered list
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

### Ordered list
1. Step one
2. Step two
3. Step three`;

const CODE_MARKDOWN = `## Code block

\`\`\`typescript
function greet(name: string): string {
    return \`Hello, \${name}!\`;
}

const result = greet("world");
console.log(result);
\`\`\``;

const TABLE_MARKDOWN = `## Table

| Feature | Status | Notes |
|---------|--------|-------|
| Headings | Supported | h1-h6 |
| Bold/Italic | Supported | GFM syntax |
| Code blocks | Supported | With syntax hints |
| Tables | Supported | GFM tables |
| Links | Supported | Sanitized |`;

const GFM_MARKDOWN = `## GFM features

- [x] Task list checked
- [ ] Task list unchecked
- [x] Another completed task

This has a line break
right here (GFM breaks enabled).

~~Strikethrough text~~`;

export default function MarkdownDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="MarkdownDemo">
                <h2>Markdown</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Renders markdown strings as sanitized HTML using marked (GFM) and DOMPurify. Strips non-standard XML
                    tags.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Basic markdown">
                        <h3>Basic markdown</h3>
                        <div
                            style={{
                                padding: "1rem",
                                background: "var(--muted)",
                                "border-radius": "0.5rem",
                            }}
                        >
                            <Markdown>{BASIC_MARKDOWN}</Markdown>
                        </div>
                    </section>

                    <section data-label="Lists">
                        <h3>Lists</h3>
                        <div
                            style={{
                                padding: "1rem",
                                background: "var(--muted)",
                                "border-radius": "0.5rem",
                            }}
                        >
                            <Markdown>{LIST_MARKDOWN}</Markdown>
                        </div>
                    </section>

                    <section data-label="Code blocks">
                        <h3>Code blocks</h3>
                        <div
                            style={{
                                padding: "1rem",
                                background: "var(--muted)",
                                "border-radius": "0.5rem",
                            }}
                        >
                            <Markdown>{CODE_MARKDOWN}</Markdown>
                        </div>
                    </section>

                    <section data-label="Tables">
                        <h3>Tables</h3>
                        <div
                            style={{
                                padding: "1rem",
                                background: "var(--muted)",
                                "border-radius": "0.5rem",
                            }}
                        >
                            <Markdown>{TABLE_MARKDOWN}</Markdown>
                        </div>
                    </section>

                    <section data-label="GFM features">
                        <h3>GFM features</h3>
                        <div
                            style={{
                                padding: "1rem",
                                background: "var(--muted)",
                                "border-radius": "0.5rem",
                            }}
                        >
                            <Markdown>{GFM_MARKDOWN}</Markdown>
                        </div>
                    </section>

                    <section data-label="Size variants">
                        <h3>Size variants</h3>
                        <div style={{ display: "flex", "flex-direction": "column", gap: "1rem" }}>
                            <div>
                                <strong>Inherit (default)</strong>
                                <div
                                    style={{
                                        padding: "1rem",
                                        background: "var(--muted)",
                                        "border-radius": "0.5rem",
                                        "margin-top": "0.25rem",
                                    }}
                                >
                                    <Markdown>{"A paragraph with **bold** and `code` at inherit size."}</Markdown>
                                </div>
                            </div>
                            <div>
                                <strong>Small</strong>
                                <div
                                    style={{
                                        padding: "1rem",
                                        background: "var(--muted)",
                                        "border-radius": "0.5rem",
                                        "margin-top": "0.25rem",
                                    }}
                                >
                                    <Markdown size="small">
                                        {"A paragraph with **bold** and `code` at small size."}
                                    </Markdown>
                                </div>
                            </div>
                            <div>
                                <strong>Extra small</strong>
                                <div
                                    style={{
                                        padding: "1rem",
                                        background: "var(--muted)",
                                        "border-radius": "0.5rem",
                                        "margin-top": "0.25rem",
                                    }}
                                >
                                    <Markdown size="xsmall">
                                        {"A paragraph with **bold** and `code` at extra small size."}
                                    </Markdown>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section data-label="Empty and undefined">
                        <h3>Empty and undefined</h3>
                        <div style={{ display: "flex", "flex-direction": "column", gap: "0.5rem" }}>
                            <div>
                                <strong>Empty string:</strong>
                                <div
                                    style={{
                                        padding: "1rem",
                                        background: "var(--muted)",
                                        "border-radius": "0.5rem",
                                        "min-height": "2rem",
                                        "margin-top": "0.25rem",
                                    }}
                                >
                                    <Markdown>{""}</Markdown>
                                </div>
                            </div>
                            <div>
                                <strong>Undefined:</strong>
                                <div
                                    style={{
                                        padding: "1rem",
                                        background: "var(--muted)",
                                        "border-radius": "0.5rem",
                                        "min-height": "2rem",
                                        "margin-top": "0.25rem",
                                    }}
                                >
                                    <Markdown>{undefined}</Markdown>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
