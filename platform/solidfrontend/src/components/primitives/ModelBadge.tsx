import type { ComponentProps, JSX } from "solid-js";
import { Badge } from "./Badge";

type BadgeVariant =
    | "default"
    | "ghost"
    | "outline"
    | "muted"
    | "primary"
    | "secondary"
    | "accent"
    | "info"
    | "success"
    | "warning"
    | "destructive";

interface Props extends Omit<ComponentProps<"span">, "class"> {
    model: string;
    variant?: BadgeVariant;
    class?: string;
}

export function ModelBadge(props: Props): JSX.Element {
    const displayName = () => formatModelName(props.model);
    const color = () => providerColor(props.model);

    return (
        <Badge
            variant={props.variant ?? "muted"}
            class={props.class}
            title={props.model}
            style={color() ? { background: color()?.bg, color: color()?.fg } : undefined}
        >
            {displayName()}
        </Badge>
    );
}

function formatModelName(model: string): string {
    const withoutTimestamp = model.replace(/-\d{8}$/, "");
    const withSpaces = withoutTimestamp.replace(/-/g, " ");
    return withSpaces.replace(/(\d+)\s+(\d+)/g, "$1.$2");
}

// --color-3 (anthropic), --color-8 (openai), --color-15 (gemini)
const PROVIDER_COLORS: Record<string, { bg: string; fg: string }> = {
    anthropic: { bg: "var(--color-3)", fg: "color-mix(in srgb, var(--color-3) 40%, black)" },
    openai: { bg: "var(--color-8)", fg: "color-mix(in srgb, var(--color-8) 40%, black)" },
    gemini: { bg: "var(--color-15)", fg: "color-mix(in srgb, var(--color-15) 40%, black)" },
};

function providerColor(model: string): { bg: string; fg: string } | null {
    const m = model.toLowerCase();
    if (m.includes("claude") || m.includes("anthropic")) return PROVIDER_COLORS.anthropic;
    if (m.includes("gpt") || m.includes("o1") || m.includes("o3") || m.includes("o4")) return PROVIDER_COLORS.openai;
    if (m.includes("gemini")) return PROVIDER_COLORS.gemini;
    return null;
}
