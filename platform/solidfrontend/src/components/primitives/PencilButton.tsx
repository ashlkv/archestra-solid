import type { ComponentProps, JSX } from "solid-js";
import { splitProps } from "solid-js";
import { Pencil } from "@/components/icons";
import { Button } from "./Button";

type Props = {
    tooltip: string;
    variant?: ComponentProps<typeof Button>["variant"];
    size?: ComponentProps<typeof Button>["size"];
    class?: string;
} & Omit<ComponentProps<typeof Button>, "variant" | "size" | "class" | "children">;

export function PencilButton(props: Props): JSX.Element {
    const [local, rest] = splitProps(props, ["tooltip", "variant", "size", "class"]);

    const iconSize = () => {
        if (local.size === "icon-small") return 14;
        return 16;
    };

    return (
        <Button
            variant={local.variant}
            size={local.size ?? "icon-small"}
            class={local.class}
            tooltip={local.tooltip}
            aria-label={local.tooltip}
            {...rest}
        >
            <Pencil size={iconSize()} />
        </Button>
    );
}
