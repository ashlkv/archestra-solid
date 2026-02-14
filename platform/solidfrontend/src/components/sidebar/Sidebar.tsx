import { A, useLocation } from "@solidjs/router";
import { For, type JSX } from "solid-js";
import {
    Bot,
    Cable,
    DollarSign,
    MessageCircle,
    MessagesSquare,
    Network,
    Router,
    Settings,
    Shield,
    Wrench,
} from "~/components/icons";
import styles from "./Sidebar.module.css";

interface MenuItem {
    title: string;
    url: string;
    icon: () => JSX.Element;
    matchPrefix?: string;
}

const navigationItems: MenuItem[] = [
    {
        title: "New Chat",
        url: "/chat",
        icon: () => <MessageCircle />,
    },
    {
        title: "Agents",
        url: "/agents",
        icon: () => <Bot />,
    },
    {
        title: "MCP Gateways",
        url: "/mcp-gateways",
        icon: () => <Shield />,
    },
    {
        title: "LLM Proxies",
        url: "/llm-proxies",
        icon: () => <Network />,
    },
    {
        title: "Logs",
        url: "/logs/llm-proxy",
        icon: () => <MessagesSquare />,
        matchPrefix: "/logs",
    },
    {
        title: "Tools",
        url: "/tools",
        icon: () => <Wrench />,
        matchPrefix: "/tools",
    },
    {
        title: "MCP Registry",
        url: "/mcp-catalog/registry",
        icon: () => <Router />,
        matchPrefix: "/mcp-catalog",
    },
    {
        title: "Cost & Limits",
        url: "/cost",
        icon: () => <DollarSign />,
    },
    {
        title: "Connect",
        url: "/connection",
        icon: () => <Cable />,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: () => <Settings />,
        matchPrefix: "/settings",
    },
];

const enabledRoutes = ["/mcp-catalog", "/tools"];

function isEnabled(item: MenuItem): boolean {
    const prefix = item.matchPrefix ?? item.url;
    return enabledRoutes.some((route) => prefix.startsWith(route));
}

function isActive(item: MenuItem, pathname: string): boolean {
    const prefix = item.matchPrefix ?? item.url;
    return pathname.startsWith(prefix);
}

export function Sidebar(props: { class?: string }): JSX.Element {
    const location = useLocation();

    return (
        <aside class={`${styles.sidebar}${props.class ? ` ${props.class}` : ""}`} data-label="Sidebar">
            <div class={styles.header}>
                <img src="/logo.png" alt="Logo" class={styles.logo} />
                <span class={styles.title}>Archestra.AI</span>
            </div>

            <div class={styles.content}>
                <ul class={styles.menu}>
                    <For each={navigationItems}>
                        {(item) => {
                            const enabled = isEnabled(item);
                            const active = () => isActive(item, location.pathname);

                            return (
                                <li>
                                    <A
                                        href={enabled ? item.url : "#"}
                                        class={`${styles["menu-item"]} ${active() ? styles.active : ""} ${!enabled ? styles.disabled : ""}`}
                                        data-label={item.title}
                                    >
                                        {item.icon()}
                                        <span>{item.title}</span>
                                    </A>
                                </li>
                            );
                        }}
                    </For>
                </ul>
            </div>
        </aside>
    );
}
