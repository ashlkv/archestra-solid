import type { JSX, ParentProps } from "solid-js";
import { CircleHelp } from "@/components/icons";
import styles from "./HelpTrigger.module.css";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./HoverCard";

export function HelpTrigger(props: ParentProps<{ size?: number }>): JSX.Element {
    return (
        <HoverCard openDelay={200} closeDelay={100}>
            <HoverCardTrigger>
                <span class={styles.trigger}>
                    <CircleHelp size={props.size ?? 14} />
                </span>
            </HoverCardTrigger>
            <HoverCardContent>{props.children}</HoverCardContent>
        </HoverCard>
    );
}
