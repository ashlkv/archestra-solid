import { HoverCard as KobalteHoverCard } from "@kobalte/core/hover-card";
import type { JSX, ParentProps } from "solid-js";
import styles from "./HoverCard.module.css";

type Placement =
    | "top"
    | "top-start"
    | "top-end"
    | "right"
    | "right-start"
    | "right-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "left-start"
    | "left-end";

export function HoverCard(
    props: ParentProps<{
        openDelay?: number;
        closeDelay?: number;
        placement?: Placement;
    }>,
): JSX.Element {
    return (
        <KobalteHoverCard
            openDelay={props.openDelay ?? 400}
            closeDelay={props.closeDelay ?? 100}
            placement={props.placement}
        >
            {props.children}
        </KobalteHoverCard>
    );
}

export function HoverCardTrigger(props: ParentProps): JSX.Element {
    return (
        <KobalteHoverCard.Trigger as="span" class={styles.trigger}>
            {props.children}
        </KobalteHoverCard.Trigger>
    );
}

export function HoverCardContent(props: ParentProps<{ class?: string }>): JSX.Element {
    return (
        <KobalteHoverCard.Portal>
            <KobalteHoverCard.Content class={`${styles.content} ${props.class ?? ""}`}>
                {props.children}
            </KobalteHoverCard.Content>
        </KobalteHoverCard.Portal>
    );
}
