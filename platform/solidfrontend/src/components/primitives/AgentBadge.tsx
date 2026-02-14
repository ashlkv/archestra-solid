import type { JSX } from "solid-js";
import { Match, Switch } from "solid-js";
import { MessageCircle } from "@/components/icons";
import { IconClaudeCode } from "@/components/mcp-icons/IconClaudeCode";
import { Badge } from "./Badge";

type SessionSource = "claude_code" | "header" | "openai_user" | string | null | undefined;

interface Props {
    source: SessionSource;
}

export function AgentBadge(props: Props): JSX.Element {
    return (
        <Switch>
            <Match when={props.source === "header"}>
                <Badge variant="info">
                    <MessageCircle style={{ width: "12px", height: "12px" }} />
                    Chat
                </Badge>
            </Match>
            <Match when={props.source === "claude_code"}>
                <Badge variant="muted">
                    <IconClaudeCode size={12} />
                    Claude Code
                </Badge>
            </Match>
        </Switch>
    );
}
