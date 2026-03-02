import { A, useLocation } from "@solidjs/router";
import { For, type JSX, type ParentProps } from "solid-js";
import styles from "./UiLayout.module.css";

const modules = import.meta.glob("../../routes/ui/*.tsx");

const ITEMS = Object.keys(modules)
	.map((path) => {
		const filename = path.split("/").pop()!.replace(".tsx", "");
		if (filename === "index") return undefined;
		const title = filename.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
		return { title, url: `/ui/${filename}` };
	})
	.filter((item): item is { title: string; url: string } => item !== undefined)
	.sort((a, b) => a.title.localeCompare(b.title));

export function UiLayout(props: ParentProps): JSX.Element {
    const location = useLocation();

    return (
        <div class={styles.layout}>
            <nav class={styles.sidebar} data-label="UiDemoSidebar">
                <div class={styles.header}>Components</div>
                <div class={styles.nav}>
                    <For each={ITEMS}>
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
                </div>
            </nav>
            <div class={styles.content}>{props.children}</div>
        </div>
    );
}
