import type { JSX } from "solid-js";
import styles from "./ProviderModelBadge.module.css";

interface Props {
    provider: string;
    model: string;
    class?: string;
}

function formatModelName(model: string): string {
    const withoutTimestamp = model.replace(/-\d{8}$/, "");
    const withSpaces = withoutTimestamp.replace(/-/g, " ");
    return withSpaces.replace(/(\d+)\s+(\d+)/g, "$1.$2");
}

function formatProviderName(provider: string): string {
    const names: Record<string, string> = {
        openai: "OpenAI",
        anthropic: "Anthropic",
        gemini: "Gemini",
        bedrock: "Bedrock",
        mistral: "Mistral",
        cohere: "Cohere",
        cerebras: "Cerebras",
        ollama: "Ollama",
        vllm: "vLLM",
        zhipuai: "ZhipuAI",
    };
    return names[provider] ?? provider;
}

export function ProviderModelBadge(props: Props): JSX.Element {
    return (
        <span class={`${styles.badge} ${props.class ?? ""}`} title={`${props.provider} / ${props.model}`}>
            <span class={styles.provider}>{formatProviderName(props.provider)}</span>
            <span class={styles.model}>{formatModelName(props.model)}</span>
        </span>
    );
}
