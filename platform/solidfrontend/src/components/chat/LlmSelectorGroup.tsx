import type { SupportedProvider } from "@shared";
import type { JSX } from "solid-js";
import { ApiKeySelector } from "./ApiKeySelector";
import { ModelSelector } from "./ModelSelector";
import styles from "./LlmSelectorGroup.module.css";

export function LlmSelectorGroup(props: {
    selectedKeyId: string | undefined;
    onKeyChange: (keyId: string) => void;
    currentProvider?: SupportedProvider;
    selectedModel: string;
    onModelChange: (model: string) => void;
    disabled?: boolean;
    size?: "medium" | "small";
    autoSelect?: boolean;
    monochrome?: boolean;
}): JSX.Element {
    return (
        <div class={styles.group}>
            <ModelSelector
                selectedModel={props.selectedModel}
                onModelChange={props.onModelChange}
                disabled={props.disabled}
                size={props.size}
                currentProvider={props.currentProvider}
                monochrome={props.monochrome}
            />
            <span class={styles.separator}>with</span>
            <ApiKeySelector
                selectedKeyId={props.selectedKeyId}
                onKeyChange={props.onKeyChange}
                currentProvider={props.currentProvider}
                disabled={props.disabled}
                size={props.size === "small" ? "xsmall" : "small"}
                autoSelect={props.autoSelect}
            />
        </div>
    );
}
