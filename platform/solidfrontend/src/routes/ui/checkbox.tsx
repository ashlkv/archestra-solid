import { createSignal, type JSX } from "solid-js";
import { Checkbox } from "@/components/primitives/Checkbox";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function CheckboxDemo(): JSX.Element {
    const [checked, setChecked] = createSignal(false);
    const [termsAccepted, setTermsAccepted] = createSignal(false);
    const [option1, setOption1] = createSignal(true);
    const [option2, setOption2] = createSignal(false);
    const [option3, setOption3] = createSignal(false);

    const allChecked = () => option1() && option2() && option3();
    const someChecked = () => (option1() || option2() || option3()) && !allChecked();

    const onToggleAll = (value: boolean) => {
        setOption1(value);
        setOption2(value);
        setOption3(value);
    };

    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="CheckboxDemo">
                <h2>Checkbox</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Toggle control for boolean values. Supports checked, unchecked, indeterminate, and disabled states.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Basic">
                        <h3>Basic toggle</h3>
                        <div style={{ display: "flex", "align-items": "center", gap: "0.5rem", "margin-top": "0.5rem" }}>
                            <Checkbox checked={checked()} onChange={setChecked} />
                            <span>Checked: {checked() ? "true" : "false"}</span>
                        </div>
                    </section>

                    <section data-label="States">
                        <h3>States</h3>
                        <div style={{ display: "flex", "flex-direction": "column", gap: "0.75rem", "margin-top": "0.5rem" }}>
                            <div style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                                <Checkbox checked={false} />
                                <span>Unchecked</span>
                            </div>
                            <div style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                                <Checkbox checked={true} />
                                <span>Checked</span>
                            </div>
                            <div style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                                <Checkbox indeterminate={true} />
                                <span>Indeterminate</span>
                            </div>
                            <div style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                                <Checkbox disabled />
                                <span>Disabled</span>
                            </div>
                            <div style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                                <Checkbox checked={true} disabled />
                                <span>Checked + disabled</span>
                            </div>
                        </div>
                    </section>

                    <section data-label="Indeterminate">
                        <h3>Indeterminate (select all)</h3>
                        <div style={{ display: "flex", "flex-direction": "column", gap: "0.5rem", "margin-top": "0.5rem" }}>
                            <div style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                                <Checkbox
                                    checked={allChecked()}
                                    indeterminate={someChecked()}
                                    onChange={onToggleAll}
                                />
                                <span style={{ "font-weight": "bold" }}>Select all</span>
                            </div>
                            <div style={{ "padding-left": "1.5rem", display: "flex", "flex-direction": "column", gap: "0.5rem" }}>
                                <div style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                                    <Checkbox checked={option1()} onChange={setOption1} />
                                    <span>Option 1</span>
                                </div>
                                <div style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                                    <Checkbox checked={option2()} onChange={setOption2} />
                                    <span>Option 2</span>
                                </div>
                                <div style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                                    <Checkbox checked={option3()} onChange={setOption3} />
                                    <span>Option 3</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section data-label="Form example">
                        <h3>Form example</h3>
                        <div style={{ display: "flex", "align-items": "center", gap: "0.5rem", "margin-top": "0.5rem" }}>
                            <Checkbox checked={termsAccepted()} onChange={setTermsAccepted} id="terms" />
                            <label for="terms">I accept the terms and conditions</label>
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
