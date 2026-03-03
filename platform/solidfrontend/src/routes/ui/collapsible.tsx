import { createSignal, type JSX } from "solid-js";
import { ChevronDown, ChevronRight } from "@/components/icons";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/primitives/Collapsible";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function CollapsibleDemo(): JSX.Element {
    const [controlledOpen, setControlledOpen] = createSignal(false);

    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="CollapsibleDemo">
                <h2>Collapsible</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Expandable section that shows or hides content. Supports controlled, uncontrolled, and default-open modes.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Uncontrolled">
                        <h3>Uncontrolled</h3>
                        <div style={{ "margin-top": "0.5rem", border: "1px solid var(--border)", "border-radius": "0.5rem", padding: "0.75rem" }}>
                            <Collapsible>
                                <CollapsibleTrigger>
                                    <span style={{ display: "flex", "align-items": "center", gap: "0.5rem", cursor: "pointer" }}>
                                        <ChevronRight size={16} />
                                        Click to expand
                                    </span>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <p style={{ "margin-top": "0.5rem", color: "var(--muted-foreground)" }}>
                                        This content is hidden by default and revealed when the trigger is clicked.
                                    </p>
                                </CollapsibleContent>
                            </Collapsible>
                        </div>
                    </section>

                    <section data-label="Default open">
                        <h3>Default open</h3>
                        <div style={{ "margin-top": "0.5rem", border: "1px solid var(--border)", "border-radius": "0.5rem", padding: "0.75rem" }}>
                            <Collapsible defaultOpen>
                                <CollapsibleTrigger>
                                    <span style={{ display: "flex", "align-items": "center", gap: "0.5rem", cursor: "pointer" }}>
                                        <ChevronDown size={16} />
                                        Click to collapse
                                    </span>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <p style={{ "margin-top": "0.5rem", color: "var(--muted-foreground)" }}>
                                        This content is visible by default and can be collapsed.
                                    </p>
                                </CollapsibleContent>
                            </Collapsible>
                        </div>
                    </section>

                    <section data-label="Controlled">
                        <h3>Controlled</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.5rem" }}>
                            Open state: {controlledOpen() ? "true" : "false"}
                        </p>
                        <div style={{ "margin-top": "0.5rem", border: "1px solid var(--border)", "border-radius": "0.5rem", padding: "0.75rem" }}>
                            <Collapsible open={controlledOpen()} onOpenChange={setControlledOpen}>
                                <CollapsibleTrigger>
                                    <span style={{ display: "flex", "align-items": "center", gap: "0.5rem", cursor: "pointer" }}>
                                        {controlledOpen() ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                        Controlled collapsible
                                    </span>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <p style={{ "margin-top": "0.5rem", color: "var(--muted-foreground)" }}>
                                        This collapsible is controlled externally. The open state is managed by a signal.
                                    </p>
                                </CollapsibleContent>
                            </Collapsible>
                        </div>
                    </section>

                    <section data-label="Multiple sections">
                        <h3>Multiple sections</h3>
                        <div style={{ "margin-top": "0.5rem", display: "flex", "flex-direction": "column", gap: "0.5rem" }}>
                            <div style={{ border: "1px solid var(--border)", "border-radius": "0.5rem", padding: "0.75rem" }}>
                                <Collapsible>
                                    <CollapsibleTrigger>
                                        <span style={{ display: "flex", "align-items": "center", gap: "0.5rem", cursor: "pointer", "font-weight": "bold" }}>
                                            <ChevronRight size={16} />
                                            Section A
                                        </span>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <p style={{ "margin-top": "0.5rem", color: "var(--muted-foreground)" }}>Content for section A.</p>
                                    </CollapsibleContent>
                                </Collapsible>
                            </div>
                            <div style={{ border: "1px solid var(--border)", "border-radius": "0.5rem", padding: "0.75rem" }}>
                                <Collapsible>
                                    <CollapsibleTrigger>
                                        <span style={{ display: "flex", "align-items": "center", gap: "0.5rem", cursor: "pointer", "font-weight": "bold" }}>
                                            <ChevronRight size={16} />
                                            Section B
                                        </span>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <p style={{ "margin-top": "0.5rem", color: "var(--muted-foreground)" }}>Content for section B.</p>
                                    </CollapsibleContent>
                                </Collapsible>
                            </div>
                            <div style={{ border: "1px solid var(--border)", "border-radius": "0.5rem", padding: "0.75rem" }}>
                                <Collapsible>
                                    <CollapsibleTrigger>
                                        <span style={{ display: "flex", "align-items": "center", gap: "0.5rem", cursor: "pointer", "font-weight": "bold" }}>
                                            <ChevronRight size={16} />
                                            Section C
                                        </span>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <p style={{ "margin-top": "0.5rem", color: "var(--muted-foreground)" }}>Content for section C.</p>
                                    </CollapsibleContent>
                                </Collapsible>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
