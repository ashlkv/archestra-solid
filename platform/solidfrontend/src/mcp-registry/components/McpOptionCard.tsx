import { Show, type JSX } from "solid-js";
import { getIcon } from "@/mcp-icons/icon-registry";
import { getMcpOptionCardClassNames, shouldShowMcpOptionSelectedIndicator } from "./McpOptionCard.utils";
import styles from "./McpOptionCard.module.css";

export function McpOptionCard(props: {
    name: string;
    description?: string | null;
    iconName?: string;
    selected?: boolean;
    endContent?: JSX.Element;
    class?: string;
}): JSX.Element {
    const cardClass = () =>
        getMcpOptionCardClassNames({
            selected: props.selected,
            class: props.class,
            baseClassName: styles.card,
            selectedClassName: styles.selected,
        });

    const Icon = getIcon(props.iconName ?? props.name);
    const showCheck = () =>
        shouldShowMcpOptionSelectedIndicator({
            selected: props.selected,
            hasEndContent: Boolean(props.endContent),
        });

    return (
        <div class={cardClass()} data-label={`MCP option: ${props.name}`}>
            <div class={styles.icon} data-label="Icon">
                <Icon size={18} />
            </div>
            <div class={styles.content}>
                <p class={styles.name} data-label="Name">
                    {props.name}
                </p>
                <div class={styles.description} data-label="Description">
                    {props.description ?? ""}
                </div>
            </div>
            <div class={styles.end} data-label="End content">
                {props.endContent}
                <Show when={showCheck()}>
                    <CheckIcon />
                </Show>
            </div>
        </div>
    );
}

function CheckIcon(): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class={styles.check}
            data-label="Selected indicator"
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}
