import { A, useLocation } from "@solidjs/router";
import { createEffect, createSignal, For, type JSX } from "solid-js";
import {
    Bot,
    Cable,
    DollarSign,
    MessageCircle,
    MessagesSquare,
    Network,
    Settings,
    Shield,
    Wrench,
} from "~/icons";
import { Tooltip } from "@/primitives/Tooltip";
import styles from "./Sidebar.module.css";
import { SidebarHeader } from "./SidebarHeader";

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
        title: "Tools",
        url: "/mcp-catalog/registry",
        icon: () => <Wrench />,
        matchPrefix: "/mcp-catalog",
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

const enabledRoutes = ["/mcp-catalog", "/tools", "/logs", "/chat"];

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
    const [collapsed, setCollapsed] = createSignal(true, { name: "sidebarCollapsed" });

    createEffect(function restoreCollapsedState() {
        if (typeof window === "undefined") return;
        const stored = window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY);
        if (stored === "false") {
            setCollapsed(false);
        }
    });

    const toggleCollapsed = () => {
        setCollapsed((previous) => {
            const next = !previous;
            if (typeof window !== "undefined") {
                window.localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(next));
            }
            return next;
        });
    };

    return (
        <aside
            class={`${styles.sidebar} ${collapsed() ? styles.collapsed : ""}${props.class ? ` ${props.class}` : ""}`}
            data-label="Sidebar"
        >
            <SidebarHeader collapsed={collapsed()} onToggle={toggleCollapsed} />

            <div class={styles.content}>
                <ul class={styles.menu}>
                    <For each={navigationItems}>
                        {(item) => {
                            const enabled = isEnabled(item);
                            const active = () => isActive(item, location.pathname);

                            return (
                                <li>
                                    <TooltipLink content={item.title} enabled={collapsed()}>
                                        <A
                                            href={enabled ? item.url : "#"}
                                            class={`${styles["menu-item"]} ${active() ? styles.active : ""} ${!enabled ? styles.disabled : ""}`}
                                            data-label={item.title}
                                        >
                                            {item.icon()}
                                            <span class={styles["menu-item-label"]}>{item.title}</span>
                                        </A>
                                    </TooltipLink>
                                </li>
                            );
                        }}
                    </For>
                </ul>
            </div>
        </aside>
    );
}

const SIDEBAR_COLLAPSED_STORAGE_KEY = "archestra.sidebar.collapsed";

function TooltipLink(props: { content: string; enabled: boolean; children: JSX.Element }): JSX.Element {
    if (!props.enabled) return props.children;
    return <Tooltip content={props.content}>{props.children}</Tooltip>;
}
