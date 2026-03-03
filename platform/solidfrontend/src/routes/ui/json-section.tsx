import type { JSX } from "solid-js";
import { JsonSection } from "@/components/common/JsonSection";
import { UiLayout } from "@/components/ui-demo/UiLayout";

const BASIC_DATA = {
    model: "claude-opus-4-1-20250805",
    temperature: 0.7,
    tools: ["search", "calculator"],
};

const DETAILED_DATA = {
    id: "req_abc123",
    method: "POST",
    url: "/v1/chat/completions",
    headers: { "Content-Type": "application/json", Authorization: "Bearer sk-***" },
    body: {
        model: "gpt-4o",
        messages: [{ role: "user", content: "Hello" }],
        stream: true,
    },
};

const PROCESSED_DATA = {
    id: "req_abc123",
    method: "POST",
    url: "/v1/chat/completions",
    headers: { "Content-Type": "application/json", Authorization: "Bearer sk-***" },
    body: {
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: "Hello" },
        ],
        stream: true,
        max_tokens: 2048,
    },
};

export default function JsonSectionDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "800px", margin: "0 auto" }} data-label="JsonSectionDemo">
                <h1>JsonSection</h1>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Collapsible JSON viewer with copy, fold/unfold controls, and optional diff mode.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Basic collapsed">
                        <h3 style={{ "margin-bottom": "0.5rem" }}>Basic (collapsed by default)</h3>
                        <JsonSection title="Request config" data={BASIC_DATA} />
                    </section>

                    <section data-label="Default open">
                        <h3 style={{ "margin-bottom": "0.5rem" }}>Default open</h3>
                        <JsonSection title="Full request" data={DETAILED_DATA} defaultOpen />
                    </section>

                    <section data-label="With diff and help">
                        <h3 style={{ "margin-bottom": "0.5rem" }}>With diff toggle and help content</h3>
                        <JsonSection
                            title="Processed request"
                            data={PROCESSED_DATA}
                            defaultOpen
                            diffOriginal={DETAILED_DATA}
                            help={
                                <span>
                                    Shows the request after applying optimization rules. Click the diff icon to compare
                                    against the original.
                                </span>
                            }
                        />
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
