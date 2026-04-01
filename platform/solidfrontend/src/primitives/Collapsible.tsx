import { Collapsible as KobalteCollapsible } from "@kobalte/core/collapsible";
import type { JSX, ParentProps } from "solid-js";
import styles from "./Collapsible.module.css";

export function Collapsible(
    props: ParentProps<{
        open?: boolean;
        defaultOpen?: boolean;
        onOpenChange?: (open: boolean) => void;
        class?: string;
    }>,
): JSX.Element {
    return (
        <KobalteCollapsible
            open={props.open}
            defaultOpen={props.defaultOpen}
            onOpenChange={props.onOpenChange}
            class={`${styles.root} ${props.class ?? ""}`}
        >
            {props.children}
        </KobalteCollapsible>
    );
}

export function CollapsibleTrigger(props: ParentProps<{ class?: string }>): JSX.Element {
    return (
        <KobalteCollapsible.Trigger class={`${styles.trigger} ${props.class ?? ""}`}>
            {props.children}
        </KobalteCollapsible.Trigger>
    );
}

export function CollapsibleContent(props: ParentProps<{ class?: string }>): JSX.Element {
    return (
        <KobalteCollapsible.Content class={`${styles.content} ${props.class ?? ""}`}>
            {props.children}
        </KobalteCollapsible.Content>
    );
}
