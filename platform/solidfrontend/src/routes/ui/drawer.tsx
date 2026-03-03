import { createSignal, type JSX } from "solid-js";
import { Button } from "@/components/primitives/Button";
import { Drawer, DrawerContent, DrawerFooter, DrawerTrigger } from "@/components/primitives/Drawer";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function DrawerDemo(): JSX.Element {
    const [controlledOpen, setControlledOpen] = createSignal(false);

    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="DrawerDemo">
                <h2>Drawer</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Slide-in panel from the right side for detail views or forms. Supports sizes (small to full), title, description, header content, footer, and no-padding mode.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Sizes">
                        <h3>Sizes</h3>
                        <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem", "margin-top": "0.5rem" }}>
                            <Drawer>
                                <DrawerTrigger>
                                    <Button variant="outline">Small</Button>
                                </DrawerTrigger>
                                <DrawerContent title="Small drawer" description="This is a small drawer." size="small">
                                    <p>Small drawer content goes here.</p>
                                </DrawerContent>
                            </Drawer>

                            <Drawer>
                                <DrawerTrigger>
                                    <Button variant="outline">Medium (default)</Button>
                                </DrawerTrigger>
                                <DrawerContent title="Medium drawer" description="This is the default medium size." size="medium">
                                    <p>Medium drawer content goes here.</p>
                                </DrawerContent>
                            </Drawer>

                            <Drawer>
                                <DrawerTrigger>
                                    <Button variant="outline">Large</Button>
                                </DrawerTrigger>
                                <DrawerContent title="Large drawer" description="This is a large drawer." size="large">
                                    <p>Large drawer content goes here.</p>
                                </DrawerContent>
                            </Drawer>

                            <Drawer>
                                <DrawerTrigger>
                                    <Button variant="outline">Extra large</Button>
                                </DrawerTrigger>
                                <DrawerContent title="Extra large drawer" description="This is an extra large drawer." size="xlarge">
                                    <p>Extra large drawer content goes here.</p>
                                </DrawerContent>
                            </Drawer>

                            <Drawer>
                                <DrawerTrigger>
                                    <Button variant="outline">Full</Button>
                                </DrawerTrigger>
                                <DrawerContent title="Full drawer" description="This drawer takes the full width." size="full">
                                    <p>Full-width drawer content goes here.</p>
                                </DrawerContent>
                            </Drawer>
                        </div>
                    </section>

                    <section data-label="With footer">
                        <h3>With footer</h3>
                        <div style={{ "margin-top": "0.5rem" }}>
                            <Drawer>
                                <DrawerTrigger>
                                    <Button>Open drawer with footer</Button>
                                </DrawerTrigger>
                                <DrawerContent title="Edit item" description="Make changes to your item below.">
                                    <div style={{ display: "flex", "flex-direction": "column", gap: "1rem" }}>
                                        <div>
                                            <label style={{ display: "block", "margin-bottom": "0.25rem", "font-weight": "bold" }}>Name</label>
                                            <input
                                                type="text"
                                                value="My item"
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
                                                rows={4}
                                                style={{
                                                    width: "100%",
                                                    padding: "0.5rem",
                                                    border: "1px solid var(--border)",
                                                    "border-radius": "0.375rem",
                                                    background: "var(--background)",
                                                    color: "var(--foreground)",
                                                    resize: "vertical",
                                                }}
                                            >
                                                A sample description for this item.
                                            </textarea>
                                        </div>
                                    </div>
                                    <DrawerFooter>
                                        <div style={{ display: "flex", "justify-content": "flex-end", gap: "0.5rem" }}>
                                            <Button variant="outline">Cancel</Button>
                                            <Button>Save changes</Button>
                                        </div>
                                    </DrawerFooter>
                                </DrawerContent>
                            </Drawer>
                        </div>
                    </section>

                    <section data-label="With header content">
                        <h3>With header content</h3>
                        <div style={{ "margin-top": "0.5rem" }}>
                            <Drawer>
                                <DrawerTrigger>
                                    <Button variant="outline">Open drawer with header content</Button>
                                </DrawerTrigger>
                                <DrawerContent
                                    title="Server details"
                                    description="Viewing configuration for this MCP server."
                                    headerContent={
                                        <div style={{ display: "flex", gap: "0.5rem", "padding-top": "0.5rem" }}>
                                            <Button variant="outline" size="small">Restart</Button>
                                            <Button variant="outline" size="small">View logs</Button>
                                        </div>
                                    }
                                >
                                    <p>Main drawer body content here.</p>
                                </DrawerContent>
                            </Drawer>
                        </div>
                    </section>

                    <section data-label="No padding">
                        <h3>No padding</h3>
                        <div style={{ "margin-top": "0.5rem" }}>
                            <Drawer>
                                <DrawerTrigger>
                                    <Button variant="outline">Open no-padding drawer</Button>
                                </DrawerTrigger>
                                <DrawerContent title="No padding" noPadding>
                                    <div style={{ background: "var(--muted)", padding: "2rem", "min-height": "200px" }}>
                                        <p>This drawer has no body padding. The content fills edge to edge.</p>
                                    </div>
                                </DrawerContent>
                            </Drawer>
                        </div>
                    </section>

                    <section data-label="Controlled">
                        <h3>Controlled</h3>
                        <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.5rem" }}>
                            Open state: {controlledOpen() ? "true" : "false"}
                        </p>
                        <div style={{ display: "flex", gap: "0.5rem", "margin-top": "0.5rem" }}>
                            <Button onClick={() => setControlledOpen(true)}>Open controlled drawer</Button>
                            <Drawer open={controlledOpen()} onOpenChange={setControlledOpen}>
                                <DrawerContent title="Controlled drawer">
                                    <p>This drawer is opened and closed programmatically via a signal.</p>
                                    <DrawerFooter>
                                        <div style={{ display: "flex", "justify-content": "flex-end" }}>
                                            <Button onClick={() => setControlledOpen(false)}>Close</Button>
                                        </div>
                                    </DrawerFooter>
                                </DrawerContent>
                            </Drawer>
                        </div>
                    </section>

                    <section data-label="Title element">
                        <h3>Custom title element</h3>
                        <div style={{ "margin-top": "0.5rem" }}>
                            <Drawer>
                                <DrawerTrigger>
                                    <Button variant="outline">Open with custom title</Button>
                                </DrawerTrigger>
                                <DrawerContent
                                    titleElement={
                                        <span style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                                            <span style={{ width: "8px", height: "8px", "border-radius": "50%", background: "var(--success)" }} />
                                            Custom title element
                                        </span>
                                    }
                                >
                                    <p>This drawer uses a custom JSX element for the title instead of a plain string.</p>
                                </DrawerContent>
                            </Drawer>
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
