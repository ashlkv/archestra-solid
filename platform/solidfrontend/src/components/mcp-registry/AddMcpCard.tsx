import styles from "./AddMcpCard.module.css";

type Props = {
    onClick?: () => void;
};

export function AddMcpCard(props: Props) {
    return (
        <button class={styles.card} onClick={props.onClick}>
            <div class={styles.icon}>
                <IconPlus />
            </div>
            <div class={styles.content}>
                <p class={styles.title}>Add MCP server to the registry</p>
                <p class={styles.subtitle}>Connect external servers via URL or local path</p>
            </div>
        </button>
    );
}

function IconPlus() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
        >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}
