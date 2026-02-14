import { For, Show } from "solid-js";
import { Plus, Trash2 } from "@/components/icons";
import { Button } from "../primitives/Button";
import { Checkbox } from "../primitives/Checkbox";
import { Input } from "../primitives/Input";
import { Select } from "../primitives/Select";
import { Separator } from "../primitives/Separator";
import { Textarea } from "../primitives/Textarea";
import styles from "./environment-editor.module.css";

type EnvironmentVariable = {
    key: string;
    type: "plain_text" | "secret" | "boolean" | "number";
    value?: string;
    promptOnInstallation: boolean;
    required?: boolean;
    description?: string;
    default?: string | number | boolean;
    mounted?: boolean;
};

type Props = {
    environment: EnvironmentVariable[];
    onChange: (environment: EnvironmentVariable[]) => void;
    disabled?: boolean;
};

const typeOptions = [
    { value: "plain_text", label: "Plain text" },
    { value: "secret", label: "Secret" },
    { value: "boolean", label: "Boolean" },
    { value: "number", label: "Number" },
];

export function McpEnvironmentEditor(props: Props) {
    // Compute indexed lists so we can map filtered index → global index
    const envVars = () => {
        const result: Array<{ env: EnvironmentVariable; globalIndex: number }> = [];
        for (let i = 0; i < props.environment.length; i++) {
            if (!props.environment[i].mounted) {
                result.push({ env: props.environment[i], globalIndex: i });
            }
        }
        return result;
    };

    const secretFiles = () => {
        const result: Array<{ env: EnvironmentVariable; globalIndex: number }> = [];
        for (let i = 0; i < props.environment.length; i++) {
            if (props.environment[i].mounted === true) {
                result.push({ env: props.environment[i], globalIndex: i });
            }
        }
        return result;
    };

    const updateAt = (globalIndex: number, partial: Partial<EnvironmentVariable>) => {
        const updated = [...props.environment];
        updated[globalIndex] = { ...updated[globalIndex], ...partial };
        props.onChange(updated);
    };

    const removeAt = (globalIndex: number) => {
        const updated = [...props.environment];
        updated.splice(globalIndex, 1);
        props.onChange(updated);
    };

    const addVar = () => {
        props.onChange([
            ...props.environment,
            { key: "", type: "plain_text", value: "", promptOnInstallation: false, required: false, description: "" },
        ]);
    };

    const addSecretFile = () => {
        props.onChange([
            ...props.environment,
            {
                key: "",
                type: "secret",
                value: "",
                promptOnInstallation: true,
                required: false,
                description: "",
                mounted: true,
            },
        ]);
    };

    return (
        <div class={styles.root}>
            {/* Environment Variables section */}
            <div class={styles.section}>
                <div class={styles["section-header"]}>
                    <span class={styles["section-title"]}>Environment Variables</span>
                    <Button variant="outline" size="small" onClick={addVar} disabled={props.disabled}>
                        <Plus size={14} />
                        Add Variable
                    </Button>
                </div>

                <Show when={envVars().length === 0}>
                    <p class={styles.empty}>No environment variables configured.</p>
                </Show>

                <Show when={envVars().length > 0}>
                    <div class={styles["header-row"]}>
                        <span>Key</span>
                        <span>Type</span>
                        <span>Prompt</span>
                        <span>Required</span>
                        <span>Value</span>
                        <span>Description</span>
                        <span />
                    </div>
                    <For each={envVars()}>
                        {(item) => (
                            <div class={styles.row}>
                                <Input
                                    value={item.env.key}
                                    onInput={(value) => updateAt(item.globalIndex, { key: value })}
                                    placeholder="API_KEY"
                                    mono
                                    disabled={props.disabled}
                                />
                                <Select
                                    value={item.env.type}
                                    onChange={(value) =>
                                        updateAt(item.globalIndex, {
                                            type: value as EnvironmentVariable["type"],
                                            value: "",
                                        })
                                    }
                                    options={typeOptions}
                                    disabled={props.disabled}
                                />
                                <div class={styles["checkbox-cell"]}>
                                    <Checkbox
                                        checked={item.env.promptOnInstallation}
                                        onChange={(checked) =>
                                            updateAt(item.globalIndex, {
                                                promptOnInstallation: checked,
                                                ...(!checked && { required: false }),
                                            })
                                        }
                                        disabled={props.disabled}
                                    />
                                </div>
                                <div class={styles["checkbox-cell"]}>
                                    <Checkbox
                                        checked={item.env.required ?? false}
                                        onChange={(checked) => updateAt(item.globalIndex, { required: checked })}
                                        disabled={props.disabled || !item.env.promptOnInstallation}
                                    />
                                </div>
                                <div class={styles["value-cell"]}>
                                    <Show when={item.env.promptOnInstallation}>
                                        <span class={styles["prompted-text"]}>Prompted at installation</span>
                                    </Show>
                                    <Show when={!item.env.promptOnInstallation}>
                                        <Show when={item.env.type === "boolean"}>
                                            <div class={styles["checkbox-cell"]}>
                                                <Checkbox
                                                    checked={item.env.value === "true"}
                                                    onChange={(checked) =>
                                                        updateAt(item.globalIndex, {
                                                            value: checked ? "true" : "false",
                                                        })
                                                    }
                                                    disabled={props.disabled}
                                                />
                                            </div>
                                        </Show>
                                        <Show when={item.env.type !== "boolean"}>
                                            <Input
                                                type={
                                                    item.env.type === "secret"
                                                        ? "password"
                                                        : item.env.type === "number"
                                                          ? "number"
                                                          : "text"
                                                }
                                                value={item.env.value ?? ""}
                                                onInput={(value) => updateAt(item.globalIndex, { value })}
                                                placeholder={
                                                    item.env.default !== undefined ? String(item.env.default) : ""
                                                }
                                                mono
                                                disabled={props.disabled}
                                            />
                                        </Show>
                                    </Show>
                                </div>
                                <Input
                                    value={item.env.description ?? ""}
                                    onInput={(value) => updateAt(item.globalIndex, { description: value })}
                                    placeholder="Optional description"
                                    disabled={props.disabled}
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeAt(item.globalIndex)}
                                    disabled={props.disabled}
                                >
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        )}
                    </For>
                </Show>
            </div>

            <Separator />

            {/* Secret Files section */}
            <div class={styles.section}>
                <div class={styles["section-header"]}>
                    <span class={styles["section-title"]}>Secret Files</span>
                    <Button variant="outline" size="small" onClick={addSecretFile} disabled={props.disabled}>
                        <Plus size={14} />
                        Add Secret File
                    </Button>
                </div>

                <Show when={secretFiles().length === 0}>
                    <p class={styles.empty}>No secret files configured.</p>
                </Show>

                <Show when={secretFiles().length > 0}>
                    <div class={styles["secret-header-row"]}>
                        <span>Key</span>
                        <span>Prompt</span>
                        <span>Required</span>
                        <span>Value</span>
                        <span>Description</span>
                        <span />
                    </div>
                    <For each={secretFiles()}>
                        {(item) => (
                            <div class={styles["secret-row"]}>
                                <Input
                                    value={item.env.key}
                                    onInput={(value) => updateAt(item.globalIndex, { key: value })}
                                    placeholder="SECRET_KEY"
                                    mono
                                    disabled={props.disabled}
                                />
                                <div class={styles["checkbox-cell"]}>
                                    <Checkbox
                                        checked={item.env.promptOnInstallation}
                                        onChange={(checked) =>
                                            updateAt(item.globalIndex, {
                                                promptOnInstallation: checked,
                                                ...(!checked && { required: false }),
                                            })
                                        }
                                        disabled={props.disabled}
                                    />
                                </div>
                                <div class={styles["checkbox-cell"]}>
                                    <Checkbox
                                        checked={item.env.required ?? false}
                                        onChange={(checked) => updateAt(item.globalIndex, { required: checked })}
                                        disabled={props.disabled || !item.env.promptOnInstallation}
                                    />
                                </div>
                                <div class={styles["value-cell"]}>
                                    <Show when={item.env.promptOnInstallation}>
                                        <span class={styles["prompted-text"]}>Prompted at installation</span>
                                    </Show>
                                    <Show when={!item.env.promptOnInstallation}>
                                        <Textarea
                                            value={item.env.value ?? ""}
                                            onInput={(value) => updateAt(item.globalIndex, { value })}
                                            mono
                                            rows={3}
                                            disabled={props.disabled}
                                        />
                                    </Show>
                                </div>
                                <Input
                                    value={item.env.description ?? ""}
                                    onInput={(value) => updateAt(item.globalIndex, { description: value })}
                                    placeholder="Optional description"
                                    disabled={props.disabled}
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeAt(item.globalIndex)}
                                    disabled={props.disabled}
                                >
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        )}
                    </For>
                </Show>
            </div>
        </div>
    );
}
