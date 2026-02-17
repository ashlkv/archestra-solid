import type { ComponentProps, JSX } from "solid-js";
import { splitProps } from "solid-js";
import { Button } from "./Button";
import styles from "./DestructiveButton.module.css";

type Props = Omit<ComponentProps<typeof Button>, "variant"> & {
    variant?: "default" | "ghost" | "outline";
};

export function DestructiveButton(props: Props): JSX.Element {
    const [local, rest] = splitProps(props, ["variant", "class"]);
    return (
        <Button
            variant={local.variant ?? "ghost"}
            class={`${styles["destructive-button"]} ${local.class ?? ""}`}
            {...rest}
        />
    );
}
