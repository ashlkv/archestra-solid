import { createSignal, type JSX } from "solid-js";
import { Button } from "@/components/primitives/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/primitives/Popover";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function PopoverDemo(): JSX.Element {
    const [controlledOpen, setControlledOpen] = createSignal(false);

    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="PopoverDemo">
                <h2>Popover</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    A floating panel anchored to a trigger element. Built on Kobalte with an arrow indicator.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Basic popover">
                        <h3>Basic</h3>
                        <Popover>
                            <PopoverTrigger>
                                <Button variant="outline">Open popover</Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <div style={{ padding: "0.75rem" }}>
                                    <p style={{ "font-weight": "bold", "margin-bottom": "0.25rem" }}>Popover title</p>
                                    <p style={{ color: "var(--muted-foreground)" }}>
                                        This is a basic popover with some content inside.
                                    </p>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </section>

                    <section data-label="Controlled popover">
                        <h3>Controlled (open: {controlledOpen() ? "true" : "false"})</h3>
                        <div style={{ display: "flex", gap: "0.5rem", "align-items": "center" }}>
                            <Popover open={controlledOpen()} onOpenChange={setControlledOpen}>
                                <PopoverTrigger>
                                    <Button variant="outline">Trigger</Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div style={{ padding: "0.75rem" }}>
                                        <p>Controlled popover content</p>
                                        <Button
                                            variant="default"
                                            size="small"
                                            onClick={() => setControlledOpen(false)}
                                            style={{ "margin-top": "0.5rem" }}
                                        >
                                            Close
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <Button variant="ghost" size="small" onClick={() => setControlledOpen(!controlledOpen())}>
                                Toggle externally
                            </Button>
                        </div>
                    </section>

                    <section data-label="Rich content popover">
                        <h3>Rich content</h3>
                        <Popover>
                            <PopoverTrigger>
                                <Button>Settings</Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <div style={{ padding: "0.75rem", "min-width": "200px" }}>
                                    <p style={{ "font-weight": "bold", "margin-bottom": "0.5rem" }}>Configuration</p>
                                    <div style={{ display: "flex", "flex-direction": "column", gap: "0.5rem" }}>
                                        <label style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                                            <input type="checkbox" checked />
                                            Enable notifications
                                        </label>
                                        <label style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                                            <input type="checkbox" />
                                            Dark mode
                                        </label>
                                        <label style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                                            <input type="checkbox" checked />
                                            Auto-save
                                        </label>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
