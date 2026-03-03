import { createSignal, type JSX } from "solid-js";
import { Button } from "@/components/primitives/Button";
import { ExpandCollapseTransition } from "@/components/primitives/ExpandCollapseTransition";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function ExpandCollapseTransitionDemo(): JSX.Element {
    const [shown1, setShown1] = createSignal(false);
    const [shown2, setShown2] = createSignal(false);
    const [shown3, setShown3] = createSignal(false);

    return (
        <UiLayout>
            <div
                style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }}
                data-label="ExpandCollapseTransitionDemo"
            >
                <h2>ExpandCollapseTransition</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Animated expand/collapse wrapper using height and opacity transitions.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Default duration">
                        <h3>Default duration (200ms)</h3>
                        <Button variant="outline" onClick={() => setShown1((previous) => !previous)}>
                            {shown1() ? "Collapse" : "Expand"}
                        </Button>
                        <div style={{ "margin-top": "0.5rem" }}>
                            <ExpandCollapseTransition when={shown1()}>
                                <div
                                    style={{
                                        padding: "1rem",
                                        background: "var(--muted)",
                                        "border-radius": "0.5rem",
                                        overflow: "hidden",
                                    }}
                                >
                                    <p>This content expands and collapses with a smooth animation.</p>
                                    <p style={{ "margin-top": "0.5rem", color: "var(--muted-foreground)" }}>
                                        The default duration is 200ms with ease-out for expanding and ease-in for
                                        collapsing.
                                    </p>
                                </div>
                            </ExpandCollapseTransition>
                        </div>
                    </section>

                    <section data-label="Custom duration">
                        <h3>Slow duration (600ms)</h3>
                        <Button variant="outline" onClick={() => setShown2((previous) => !previous)}>
                            {shown2() ? "Collapse" : "Expand"}
                        </Button>
                        <div style={{ "margin-top": "0.5rem" }}>
                            <ExpandCollapseTransition when={shown2()} duration={600}>
                                <div
                                    style={{
                                        padding: "1rem",
                                        background: "var(--muted)",
                                        "border-radius": "0.5rem",
                                        overflow: "hidden",
                                    }}
                                >
                                    <p>This uses a 600ms duration for a slower, more dramatic effect.</p>
                                    <ul style={{ "margin-top": "0.5rem", "padding-left": "1.5rem" }}>
                                        <li>Item one</li>
                                        <li>Item two</li>
                                        <li>Item three</li>
                                    </ul>
                                </div>
                            </ExpandCollapseTransition>
                        </div>
                    </section>

                    <section data-label="Tall content">
                        <h3>Tall content</h3>
                        <Button variant="outline" onClick={() => setShown3((previous) => !previous)}>
                            {shown3() ? "Collapse" : "Expand"}
                        </Button>
                        <div style={{ "margin-top": "0.5rem" }}>
                            <ExpandCollapseTransition when={shown3()}>
                                <div
                                    style={{
                                        padding: "1rem",
                                        background: "var(--muted)",
                                        "border-radius": "0.5rem",
                                        overflow: "hidden",
                                        display: "flex",
                                        "flex-direction": "column",
                                        gap: "0.75rem",
                                    }}
                                >
                                    <p>This section has more content to demonstrate the height animation.</p>
                                    <p>
                                        The component uses the Web Animations API to animate height from 0 to the
                                        content's scroll height.
                                    </p>
                                    <p>
                                        A ResizeObserver watches for content height changes during expansion (e.g. if
                                        child content loads asynchronously).
                                    </p>
                                    <p>
                                        On collapse, it animates from the current height back to 0 and calls done()
                                        when the animation finishes.
                                    </p>
                                </div>
                            </ExpandCollapseTransition>
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
