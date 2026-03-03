import { A, useLocation } from "@solidjs/router";
import { For, type JSX, type ParentProps, Show } from "solid-js";
import styles from "./UiLayout.module.css";

const primitiveModules = import.meta.glob("../../components/primitives/*.tsx");
const commonModules = import.meta.glob("../../components/common/*.tsx");
const llmModules = import.meta.glob("../../components/llm/*.tsx");

type NavItem = { title: string; url: string };

function toKebab(filename: string): string {
    return filename.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function buildNavItems(modules: Record<string, unknown>, overrides?: Record<string, string>): NavItem[] {
    return Object.keys(modules)
        .map((path) => {
            const filename = toKebab(path.split("/").pop()?.replace(".tsx", "") ?? "");
            const slug = overrides?.[filename] ?? filename;
            const title = slug.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
            return { title, url: `/ui/${slug}` };
        })
        .sort((a, b) => a.title.localeCompare(b.title));
}

const PRIMITIVES = buildNavItems(primitiveModules);
const COMMON = buildNavItems(commonModules, { pagination: "pagination-logs" });
const LLM = buildNavItems(llmModules);

const COMPONENTS: NavItem[] = [
    { title: "Add MCP card", url: "/ui/add-mcp-card" },
    { title: "MCP card", url: "/ui/mcp-card" },
    { title: "MCP icons", url: "/ui/mcp-icons" },
    { title: "MCP instance hover card", url: "/ui/mcp-instance-hover-card" },
    { title: "Prompt input", url: "/ui/prompt-input" },
    { title: "Tool hover card", url: "/ui/tool-hover-card" },
];

function NavSection(props: { label: string; items: NavItem[] }): JSX.Element {
    const location = useLocation();

    return (
        <Show when={props.items.length > 0}>
            <div class={styles["section-label"]} data-label={`Section: ${props.label}`}>
                {props.label}
            </div>
            <For each={props.items}>
                {(item) => (
                    <A
                        href={item.url}
                        class={`${styles.link} ${location.pathname === item.url ? styles["link-active"] : ""}`}
                        data-label={item.title}
                    >
                        {item.title}
                    </A>
                )}
            </For>
        </Show>
    );
}

export function UiLayout(props: ParentProps): JSX.Element {
    return (
        <div class={styles.layout}>
            <nav class={styles.sidebar} data-label="UiDemoSidebar">
                <div class={styles.header}>UI</div>
                <div class={styles.nav}>
                    <NavSection label="Primitives" items={PRIMITIVES} />
                    <NavSection label="Common" items={COMMON} />
                    <NavSection label="LLM" items={LLM} />
                    <NavSection label="Components" items={COMPONENTS} />
                </div>
            </nav>
            <div class={styles.content}>{props.children}</div>
        </div>
    );
}
