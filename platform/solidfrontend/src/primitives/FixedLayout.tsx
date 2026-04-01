/**
 * Viewport-locked shell: sidebar + main area, both constrained to window height.
 * The main area scrolls independently within its fixed box, so child columns
 * (e.g. VerticalSplit) can each have their own scroll containers.
 *
 * Compare with StaticLayout, which lets the page grow beyond the viewport
 * and uses the body scrollbar instead.
 */
import { useLocation } from "@solidjs/router";
import { type JSX, type ParentProps, Show } from "solid-js";
import { Sidebar } from "~/sidebar/components/Sidebar";
import styles from "./FixedLayout.module.css";

interface Props extends ParentProps {
    class?: string;
}

export function FixedLayout(props: Props): JSX.Element {
    const location = useLocation();
    const isUiRoute = () => location.pathname.startsWith("/ui");

    return (
        <div class={styles.layout}>
            <Show when={!isUiRoute()}>
                <Sidebar />
            </Show>
            <main class={`${styles.main} ${props.class ?? ""}`}>{props.children}</main>
        </div>
    );
}
