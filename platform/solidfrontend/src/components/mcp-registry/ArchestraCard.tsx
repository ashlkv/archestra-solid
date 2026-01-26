import { IconArchestra } from "../mcp-icons/IconArchestra";
import { Badge } from "../primitives/Badge";
import styles from "./ArchestraCard.module.css";

export function ArchestraCard() {
    const onMenuClick = (event: MouseEvent) => {
        event.stopPropagation();
        // TODO: implement menu
    };

    return (
        <div class={styles.card}>
            <div class={styles.main}>
                <div class={styles.icon}>
                    <IconArchestra size={20} />
                </div>
                <div class={styles.content}>
                    <div class={styles.header}>
                        <p class={styles.name}>Archestra built-in</p>
                        <div class={styles.badges}>
                            <Badge caps variant="ghost">Local</Badge>
                            <Badge caps variant="ghost">Native</Badge>
                        </div>
                    </div>
                    <p class={styles.description}>
                        Built-in MCP server with essential tools and core system capabilities.
                    </p>
                </div>
            </div>
            <div class={styles.actions}>
                <button class={styles.menu} onClick={onMenuClick}>
                    <IconDots />
                </button>
                <div class={styles.system}>
                    <span class={styles["system-label"]}>System</span>
                    <span class={styles["system-dot"]} />
                </div>
            </div>
        </div>
    );
}

function IconDots() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
        </svg>
    );
}
