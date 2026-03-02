import { useLocation } from "@solidjs/router";
import { type JSX, type ParentProps, Show } from "solid-js";
import { Sidebar } from "~/components/sidebar/Sidebar";
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
