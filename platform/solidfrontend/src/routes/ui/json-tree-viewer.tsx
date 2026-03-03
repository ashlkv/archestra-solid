import { createSignal, type JSX } from "solid-js";
import { JsonTreeViewer } from "@/components/common/JsonTreeViewer";
import { Button } from "@/components/primitives/Button";
import { UiLayout } from "@/components/ui-demo/UiLayout";
import llmRequestExample from "./llm-request-example.json";

const MIXED_NESTED = {
    user: {
        id: "usr_123",
        profile: {
            firstName: "Bob",
            lastName: "Smith",
            address: {
                street: "123 Main St",
                city: "Portland",
                state: "OR",
                zip: "97201",
            },
        },
        roles: ["admin", "editor"],
        settings: {
            theme: "dark",
            notifications: true,
            language: "en",
        },
    },
    metadata: {
        createdAt: "2025-01-15T10:30:00Z",
        version: 3,
    },
    string: "hello world",
    emptyString: "",
    integer: 42,
    float: 9.807,
    negative: -17,
    boolTrue: true,
    boolFalse: false,
    nullValue: null,
    nestedArray: [1, "two", true, null, { nested: "object" }],
    deepNest: {
        level1: {
            level2: {
                level3: {
                    value: "deep",
                },
            },
        },
    },
};

function DemoSection(props: { title: string; data: unknown; defaultExpandDepth?: number }): JSX.Element {
    const [expandGeneration, setExpandGeneration] = createSignal(0);
    const [collapseGeneration, setCollapseGeneration] = createSignal(0);

    return (
        <section>
            <div style={{ display: "flex", "align-items": "center", gap: "0.5rem", "margin-bottom": "0.5rem" }}>
                <h3>{props.title}</h3>
                <Button variant="outline" size="small" onClick={() => setExpandGeneration((previous) => previous + 1)}>
                    Expand all
                </Button>
                <Button
                    variant="outline"
                    size="small"
                    onClick={() => setCollapseGeneration((previous) => previous + 1)}
                >
                    Collapse all
                </Button>
            </div>
            <JsonTreeViewer
                data={props.data}
                defaultExpandDepth={props.defaultExpandDepth ?? 1}
                expandGeneration={expandGeneration()}
                collapseGeneration={collapseGeneration()}
            />
        </section>
    );
}

export default function JsonTreeViewerDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "800px", margin: "0 auto" }} data-label="JsonTreeViewerDemo">
                <h1>JsonTreeViewer</h1>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Interactive JSON tree with expand/collapse, hover highlight, and copy-to-clipboard for subtrees.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <DemoSection title="Mixed nested" data={MIXED_NESTED} />
                    <DemoSection title="Large JSON" data={llmRequestExample} />
                </div>
            </div>
        </UiLayout>
    );
}
