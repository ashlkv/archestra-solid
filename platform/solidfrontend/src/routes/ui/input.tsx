import { createSignal, type JSX } from "solid-js";
import { Input } from "@/components/primitives/Input";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function InputDemo(): JSX.Element {
    const [textValue, setTextValue] = createSignal("Hello world");
    const [emailValue, setEmailValue] = createSignal("");
    const [numberValue, setNumberValue] = createSignal("");
    const [passwordValue, setPasswordValue] = createSignal("");

    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="InputDemo">
                <h2>Input</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    A styled text input with support for multiple types, sizes, and monospace mode.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Input types">
                        <h3>Input types</h3>
                        <div style={{ display: "flex", "flex-direction": "column", gap: "1rem", "max-width": "400px" }}>
                            <div>
                                <label style={{ display: "block", "margin-bottom": "0.25rem" }}>Text</label>
                                <Input
                                    type="text"
                                    value={textValue()}
                                    onInput={setTextValue}
                                    placeholder="Enter text"
                                />
                                <span style={{ color: "var(--muted-foreground)" }}>Value: {textValue()}</span>
                            </div>

                            <div>
                                <label style={{ display: "block", "margin-bottom": "0.25rem" }}>Email</label>
                                <Input
                                    type="email"
                                    value={emailValue()}
                                    onInput={setEmailValue}
                                    placeholder="user@example.com"
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", "margin-bottom": "0.25rem" }}>Password</label>
                                <Input
                                    type="password"
                                    value={passwordValue()}
                                    onInput={setPasswordValue}
                                    placeholder="Enter password"
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", "margin-bottom": "0.25rem" }}>Number</label>
                                <Input
                                    type="number"
                                    value={numberValue()}
                                    onInput={setNumberValue}
                                    placeholder="0"
                                    min={0}
                                    max={100}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", "margin-bottom": "0.25rem" }}>URL</label>
                                <Input type="url" placeholder="https://example.com" />
                            </div>
                        </div>
                    </section>

                    <section data-label="Sizes">
                        <h3>Sizes</h3>
                        <div style={{ display: "flex", "flex-direction": "column", gap: "1rem", "max-width": "400px" }}>
                            <div>
                                <label style={{ display: "block", "margin-bottom": "0.25rem" }}>
                                    Medium (default)
                                </label>
                                <Input placeholder="Medium size" />
                            </div>
                            <div>
                                <label style={{ display: "block", "margin-bottom": "0.25rem" }}>Small</label>
                                <Input size="small" placeholder="Small size" />
                            </div>
                            <div>
                                <label style={{ display: "block", "margin-bottom": "0.25rem" }}>Inherit</label>
                                <Input size="inherit" placeholder="Inherit size" />
                            </div>
                        </div>
                    </section>

                    <section data-label="Monospace">
                        <h3>Monospace mode</h3>
                        <div style={{ display: "flex", "flex-direction": "column", gap: "1rem", "max-width": "400px" }}>
                            <div>
                                <label style={{ display: "block", "margin-bottom": "0.25rem" }}>Regular</label>
                                <Input value="Regular font" />
                            </div>
                            <div>
                                <label style={{ display: "block", "margin-bottom": "0.25rem" }}>Monospace</label>
                                <Input mono value="sk-proj-abc123def456" />
                            </div>
                        </div>
                    </section>

                    <section data-label="Disabled">
                        <h3>Disabled</h3>
                        <div style={{ "max-width": "400px" }}>
                            <Input disabled value="Cannot edit this" />
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
