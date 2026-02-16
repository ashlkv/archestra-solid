import type { ComponentProps, JSX } from "solid-js";
import { splitProps } from "solid-js";
import { Pencil } from "@/components/icons";
import { Button } from "./Button";
import { Tooltip } from "./Tooltip";

type Props = {
    tooltip: string;
    variant?: ComponentProps<typeof Button>["variant"];
    size?: ComponentProps<typeof Button>["size"];
    class?: string;
} & Omit<ComponentProps<typeof Button>, "variant" | "size" | "class" | "children">;

export function PencilButton(props: Props): JSX.Element {
    const [local, rest] = splitProps(props, ["tooltip", "variant", "size", "class"]);

    const iconSize = () => {
        if (local.size === "icon-xsmall") return 12;
        if (local.size === "icon-small") return 14;
        return 16;
    };

    return (
        <Tooltip content={local.tooltip}>
            <Button
                variant={local.variant}
                size={local.size ?? "icon-small"}
                class={local.class}
                aria-label={local.tooltip}
                {...rest}
            >
                <Pencil size={iconSize()} />
            </Button>
        </Tooltip>
    );
}
