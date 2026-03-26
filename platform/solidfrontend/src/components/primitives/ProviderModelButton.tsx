import type { JSX } from "solid-js";
import { Show } from "solid-js";
import { ChevronDown } from "@/components/icons";
import { Button } from "./Button";
import styles from "./ProviderModelButton.module.css";

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

const PROVIDER_NAMES: Record<string, string> = {
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

export function ProviderModelButton(props: {
    provider: string;
    model?: string;
    showProviderLogo?: boolean;
    size?: "small" | "medium";
    chevron?: boolean;
    monochrome?: boolean;
    class?: string;
    onClick?: (event: MouseEvent) => void;
    disabled?: boolean;
}): JSX.Element {
    const colors = () => (props.monochrome ? undefined : PROVIDER_COLORS[props.provider]);

    return (
        <Button
            variant="muted"
            size={props.size}
            class={`${styles.button} ${props.class ?? ""}`}
            onClick={props.onClick}
            disabled={props.disabled}
            data-label="Provider model button"
        >
            <span
                class={styles.provider}
                style={colors() ? { background: colors()!.providerBg, color: colors()!.providerFg } : undefined}
            >
                <Show when={props.showProviderLogo}>
                    <img
                        alt=""
                        aria-hidden="true"
                        class={styles.logo}
                        height={16}
                        width={16}
                        src={`https://models.dev/logos/${props.provider === "gemini" ? "google" : props.provider}.svg`}
                    />
                </Show>
                {PROVIDER_NAMES[props.provider] ?? props.provider}
            </span>
            <Show when={props.model}>
                <span
                    class={styles.model}
                    style={colors() ? { background: colors()!.modelBg, color: colors()!.modelFg } : undefined}
                >
                    {formatModelName(props.model!)}
                    <Show when={props.chevron}>
                        <ChevronDown size={14} class={styles.chevron} />
                    </Show>
                </span>
            </Show>
        </Button>
    );
}

function formatModelName(model: string): string {
    const withoutTimestamp = model.replace(/-\d{8}$/, "");
    const withSpaces = withoutTimestamp.replace(/-/g, " ");
    return withSpaces.replace(/(\d+)\s+(\d+)/g, "$1.$2");
}
