import { A, useLocation } from "@solidjs/router";
import { For, createSignal, type JSX, type ParentProps, Show } from "solid-js";
import { SearchInput } from "@/components/primitives/SearchInput";
import styles from "./UiLayout.module.css";
import { filterUiNavItems } from "./UiLayout.utils";

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
    { title: "Editable text", url: "/ui/editable-text" },
    { title: "Add MCP card", url: "/ui/add-mcp-card" },
    { title: "MCP card", url: "/ui/mcp-card" },
    { title: "MCP icons", url: "/ui/mcp-icons" },
    { title: "MCP instance hover card", url: "/ui/mcp-instance-hover-card" },
    { title: "MCP option card", url: "/ui/mcp-option-card" },
    { title: "Prompt input", url: "/ui/prompt-input" },
    { title: "Text input", url: "/ui/text-input" },
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
    const [searchQuery, setSearchQuery] = createSignal("", { name: "searchQuery" });

    const filteredPrimitives = () => filterUiNavItems({ items: PRIMITIVES, searchQuery: searchQuery() });
    const filteredCommon = () => filterUiNavItems({ items: COMMON, searchQuery: searchQuery() });
    const filteredLlm = () => filterUiNavItems({ items: LLM, searchQuery: searchQuery() });
    const filteredComponents = () => filterUiNavItems({ items: COMPONENTS, searchQuery: searchQuery() });
    const hasResults = () =>
        filteredPrimitives().length > 0 ||
        filteredCommon().length > 0 ||
        filteredLlm().length > 0 ||
        filteredComponents().length > 0;

    return (
        <div class={styles.layout}>
            <nav class={styles.sidebar} data-label="UiDemoSidebar">
                <div class={styles.header}>UI</div>
                <div class={styles.search} data-label="UiDemoSearch">
                    <SearchInput value={searchQuery()} onChange={setSearchQuery} placeholder="Search components..." />
                </div>
                <div class={styles.nav}>
                    <NavSection label="Primitives" items={filteredPrimitives()} />
                    <NavSection label="Common" items={filteredCommon()} />
                    <NavSection label="LLM" items={filteredLlm()} />
                    <NavSection label="Components" items={filteredComponents()} />
                    <Show when={!hasResults()}>
                        <div class={styles["empty-state"]} data-label="UiDemoEmptyState">
                            No matching demos
                        </div>
                    </Show>
                </div>
            </nav>
            <div class={styles.content}>{props.children}</div>
        </div>
    );
}
