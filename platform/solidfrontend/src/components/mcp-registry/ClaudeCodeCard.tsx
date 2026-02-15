import { Dynamic } from "solid-js/web";
import { getIcon } from "../mcp-icons/icon-registry";
import { Badge } from "../primitives/Badge";
import styles from "./McpCard.module.css";

export function ClaudeCodeCard() {
    return (
        <div class={`${styles.card} ${styles["auto-discovered"]} ${styles["well-known"]}`} data-label="Card">
            <div class={styles.main} data-label="Card main">
                <div class={styles["top-row"]}>
                    <div class={styles.icon} data-label="Icon">
                        <Dynamic component={getIcon("claude code")} size={24} />
                    </div>
                    <div class={styles.header}>
                        <p class={styles.name} data-label="Name">
                            Claude Code
                        </p>
                        <div class={styles.badges} data-label="Badges">
                            <Badge variant="muted" pill caps>
                                local
                            </Badge>
                            <Badge variant="muted" pill caps>
                                auto-discovered
                            </Badge>
                        </div>
                    </div>
                </div>
                <p class={styles.description} data-label="Description">
                    Tools auto-discovered from Claude Code sessions proxied through Archestra.
                </p>
            </div>
            <div class={styles.actions} data-label="Actions">
                <div class={styles["system-info"]} data-label="Auto-discovered info">
                    <p>Auto-discovered via LLM Proxy. Cannot be installed or deleted.</p>
                </div>
            </div>
        </div>
    );
}
