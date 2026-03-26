import type { JSX } from "solid-js";
import styles from "./ProviderModelBadge.module.css";

interface Props {
    provider: string;
    model?: string;
    class?: string;
    showProviderLogo?: boolean;
    size?: "small" | "medium";
}

// --color-3 (anthropic), --color-8 (openai), --color-15 (gemini)
const PROVIDER_COLORS: Record<string, { providerBg: string; providerFg: string; modelBg: string; modelFg: string }> = {
    anthropic: {
        providerBg: "var(--color-3)",
        providerFg: "color-mix(in srgb, var(--color-3) 40%, black)",
        modelBg: "color-mix(in srgb, var(--color-3) 40%, transparent)",
        modelFg: "color-mix(in srgb, var(--color-3) 30%, black)",
    },
    openai: {
        providerBg: "var(--color-8)",
        providerFg: "color-mix(in srgb, var(--color-8) 40%, black)",
        modelBg: "color-mix(in srgb, var(--color-8) 40%, transparent)",
        modelFg: "color-mix(in srgb, var(--color-8) 30%, black)",
    },
    gemini: {
        providerBg: "var(--color-15)",
        providerFg: "color-mix(in srgb, var(--color-15) 40%, black)",
        modelBg: "color-mix(in srgb, var(--color-15) 40%, transparent)",
        modelFg: "color-mix(in srgb, var(--color-15) 30%, black)",
    },
};

export function ProviderModelBadge(props: Props): JSX.Element {
    const colors = () => PROVIDER_COLORS[props.provider];
    const showModel = () => Boolean(props.model);

    return (
        <span
            class={`${styles.badge} ${props.size === "medium" ? styles.medium : ""} ${props.class ?? ""}`}
            title={showModel() ? `${props.provider} / ${props.model}` : formatProviderName(props.provider)}
        >
            <span
                class={styles.provider}
                style={colors() ? { background: colors()?.providerBg, color: colors()?.providerFg } : undefined}
            >
                {props.showProviderLogo ? <ProviderLogo provider={props.provider} /> : null}
                {formatProviderName(props.provider)}
            </span>
            {showModel() ? (
                <span
                    class={styles.model}
                    style={colors() ? { background: colors()?.modelBg, color: colors()?.modelFg } : undefined}
                >
                    {formatModelName(props.model!)}
                </span>
            ) : null}
        </span>
    );
}

function ProviderLogo(props: { provider: string }): JSX.Element {
    return (
        <img
            alt=""
            aria-hidden="true"
            class={styles.logo}
            height={16}
            width={16}
            src={`https://models.dev/logos/${getLogoProvider(props.provider)}.svg`}
        />
    );
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

function getLogoProvider(provider: string): string {
    if (provider === "gemini") return "google";
    return provider;
}
