import type { JSX } from "solid-js";
import { Match, Switch } from "solid-js";
import { MessageCircle } from "@/components/icons";
import { IconClaudeCode } from "@/components/mcp-icons/IconClaudeCode";
import { Badge } from "./Badge";
import styles from "./SessionSourceBadge.module.css";

type SessionSource = "claude_code" | "header" | "openai_user" | string | null | undefined;

interface Props {
    source: SessionSource;
}

export function SessionSourceBadge(props: Props): JSX.Element {
    return (
        <Switch>
            <Match when={props.source === "header"}>
                <Badge variant="muted">
                    <MessageCircle style={{ width: "12px", height: "12px" }} class={styles.icon} />
                    Chat
                </Badge>
            </Match>
            <Match when={props.source === "claude_code"}>
                <Badge variant="muted">
                    <IconClaudeCode size={12} class={styles.icon} />
                    Claude Code
                </Badge>
            </Match>
        </Switch>
    );
}
