import { createSignal, type JSX } from "solid-js";
import { EditableText, type EditableTextApi } from "@/components/common/EditableText";
import { Button } from "@/components/primitives/Button";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function EditableTextDemo(): JSX.Element {
    const [singleLineText, setSingleLineText] = createSignal("Inline title");
    const [multilineText, setMultilineText] = createSignal("This editable text grows from a mirrored layer.\nIt keeps the delayed update and caret helpers from the original component.");
    const [caretInfo, setCaretInfo] = createSignal("No caret info yet.");
    let editableTextApi: EditableTextApi | undefined;

    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="EditableTextDemo">
                <h2>Editable text</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem", "max-width": "42rem" }}>
                    Vue 2 `EditableText` ported to Solid with delayed updates, done reasons, read-only mode, mirrored
                    sizing, and caret helper methods.
                </p>

                <div style={{ display: "grid", gap: "2rem" }}>
                    <section data-label="Single line">
                        <h3>Single line</h3>
                        <EditableText
                            text={singleLineText()}
                            multiline={false}
                            placeholder="Enter a title"
                            onInput={setSingleLineText}
                            onUpdate={setSingleLineText}
                        />
                    </section>

                    <section data-label="Multiline">
                        <h3>Multiline</h3>
                        <EditableText
                            text={multilineText()}
                            rows={3}
                            placeholder="Write something..."
                            onInput={setMultilineText}
                            onUpdate={setMultilineText}
                            apiRef={(api) => {
                                editableTextApi = api;
                            }}
                        />
                        <div style={{ display: "flex", gap: "0.75rem", "margin-top": "0.75rem" }}>
                            <Button
                                variant="outline"
                                size="small"
                                onClick={() => setCaretInfo(`Caret at first line: ${editableTextApi?.isCaretAtFirstLine()}`)}
                            >
                                Check first line
                            </Button>
                            <Button
                                variant="outline"
                                size="small"
                                onClick={() => setCaretInfo(`Line start at 20: ${editableTextApi?.getLineStart(20)}`)}
                            >
                                Get line start
                            </Button>
                        </div>
                        <p style={{ color: "var(--muted-foreground)", "margin-top": "0.5rem" }}>{caretInfo()}</p>
                    </section>

                    <section data-label="Static">
                        <h3>Static</h3>
                        <EditableText editable={false} text="Read-only static text" />
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
