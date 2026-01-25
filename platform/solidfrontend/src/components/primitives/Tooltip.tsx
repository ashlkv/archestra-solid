import { Tooltip as KobalteTooltip } from "@kobalte/core/tooltip";
import type { JSX, ParentProps } from "solid-js";
import styles from "./Tooltip.module.css";

interface TooltipProps extends ParentProps {
    content: string;
}

export function Tooltip(props: TooltipProps): JSX.Element {
    return (
        <KobalteTooltip openDelay={400} closeDelay={0}>
            <KobalteTooltip.Trigger as="span">
                {props.children}
            </KobalteTooltip.Trigger>
            <KobalteTooltip.Portal>
                <KobalteTooltip.Content class={styles.content}>
                    {props.content}
                </KobalteTooltip.Content>
            </KobalteTooltip.Portal>
        </KobalteTooltip>
    );
}
