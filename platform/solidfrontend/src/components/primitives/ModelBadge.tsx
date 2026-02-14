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

function formatModelName(model: string): string {
    // Remove timestamp suffix (e.g., -20251001, -20250115)
    const withoutTimestamp = model.replace(/-\d{8}$/, "");

    // Replace hyphens with spaces
    const withSpaces = withoutTimestamp.replace(/-/g, " ");

    // Replace version numbers like "4 5" with "4.5"
    const withVersionDots = withSpaces.replace(/(\d+)\s+(\d+)/g, "$1.$2");

    return withVersionDots;
}

export function ModelBadge(props: Props): JSX.Element {
    const displayName = () => formatModelName(props.model);

    return (
        <Badge variant={props.variant ?? "muted"} class={props.class} title={props.model}>
            {displayName()}
        </Badge>
    );
}
