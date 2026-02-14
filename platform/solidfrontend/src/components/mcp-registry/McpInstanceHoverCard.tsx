import { For, type JSX } from "solid-js";
import type { McpServer } from "@/types";
import { Button } from "../primitives/Button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../primitives/HoverCard";
import { McpInstanceDetails } from "./McpInstanceDetails";
import styles from "./McpInstanceHoverCard.module.css";

type Props = {
    instances: McpServer[];
    onUninstall?: (serverId: string) => void;
    children: JSX.Element;
};

export function McpInstanceHoverCard(props: Props) {
    return (
        <HoverCard>
            <HoverCardTrigger>{props.children}</HoverCardTrigger>
            <HoverCardContent class={styles.content}>
                <div class={styles.instances}>
                    <For each={props.instances}>
                        {(instance) => (
                            <div class={styles.instance}>
                                <McpInstanceDetails instance={instance} />
                                <Button
                                    variant="outline"
                                    size="small"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        props.onUninstall?.(instance.id);
                                    }}
                                >
                                    Uninstall
                                </Button>
                            </div>
                        )}
                    </For>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
