import { createSignal, type JSX } from "solid-js";
import { Button } from "@/components/primitives/Button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/primitives/Dialog";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function DialogDemo(): JSX.Element {
    const [controlledOpen, setControlledOpen] = createSignal(false);

    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="DialogDemo">
                <h2>Dialog</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Modal overlay for focused interactions. Supports small, medium, and large sizes, with trigger-based or controlled opening.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Sizes">
                        <h3>Sizes</h3>
                        <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem", "margin-top": "0.5rem" }}>
                            <Dialog>
                                <DialogTrigger>
                                    <Button variant="outline">Small dialog</Button>
                                </DialogTrigger>
                                <DialogContent title="Small dialog" size="small">
                                    <p>This is a small dialog. Good for confirmations or simple messages.</p>
                                </DialogContent>
                            </Dialog>

                            <Dialog>
                                <DialogTrigger>
                                    <Button variant="outline">Medium dialog</Button>
                                </DialogTrigger>
                                <DialogContent title="Medium dialog" size="medium">
                                    <p>This is a medium dialog. The default size, suitable for forms and content.</p>
                                </DialogContent>
                            </Dialog>

                            <Dialog>
                                <DialogTrigger>
                                    <Button variant="outline">Large dialog</Button>
                                </DialogTrigger>
                                <DialogContent title="Large dialog" size="large">
                                    <p>This is a large dialog. Use for complex content or detailed views.</p>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </section>

                    <section data-label="With content">
                        <h3>With form content</h3>
                        <div style={{ "margin-top": "0.5rem" }}>
                            <Dialog>
                                <DialogTrigger>
                                    <Button>Create new item</Button>
                                </DialogTrigger>
                                <DialogContent title="Create item">
                                    <div style={{ display: "flex", "flex-direction": "column", gap: "1rem" }}>
                                        <div>
                                            <label style={{ display: "block", "margin-bottom": "0.25rem", "font-weight": "bold" }}>Name</label>
                                            <input
                                                type="text"
                                                placeholder="Enter name..."
                                                style={{
                                                    width: "100%",
                                                    padding: "0.5rem",
                                                    border: "1px solid var(--border)",
                                                    "border-radius": "0.375rem",
                                                    background: "var(--background)",
                                                    color: "var(--foreground)",
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: "block", "margin-bottom": "0.25rem", "font-weight": "bold" }}>Description</label>
                                            <textarea
                                                placeholder="Enter description..."
                                                rows={3}
                                                style={{
                                                    width: "100%",
                                                    padding: "0.5rem",
                                                    border: "1px solid var(--border)",
                                                    "border-radius": "0.375rem",
                                                    background: "var(--background)",
                                                    color: "var(--foreground)",
                                                    resize: "vertical",
                                                }}
                                            />
                                        </div>
                                        <div style={{ display: "flex", "justify-content": "flex-end", gap: "0.5rem" }}>
                                            <Button variant="outline">Cancel</Button>
                                            <Button>Save</Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </section>

                    <section data-label="Controlled">
                        <h3>Controlled</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.5rem" }}>
                            Open state: {controlledOpen() ? "true" : "false"}
                        </p>
                        <div style={{ display: "flex", gap: "0.5rem", "margin-top": "0.5rem" }}>
                            <Button onClick={() => setControlledOpen(true)}>Open controlled dialog</Button>
                            <Dialog open={controlledOpen()} onOpenChange={setControlledOpen}>
                                <DialogContent title="Controlled dialog">
                                    <p>This dialog is opened and closed programmatically via a signal.</p>
                                    <div style={{ display: "flex", "justify-content": "flex-end", "margin-top": "1rem" }}>
                                        <Button onClick={() => setControlledOpen(false)}>Close</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </section>

                    <section data-label="No title">
                        <h3>Without title</h3>
                        <div style={{ "margin-top": "0.5rem" }}>
                            <Dialog>
                                <DialogTrigger>
                                    <Button variant="outline">Open titleless dialog</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <p>This dialog has no title, just content. The close button is still available.</p>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
