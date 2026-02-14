import { Tabs as KobalteTabs } from "@kobalte/core/tabs";
import type { JSX, ParentProps } from "solid-js";
import styles from "./Tabs.module.css";

export function Tabs(props: ParentProps<{
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
}>): JSX.Element {
    return (
        <KobalteTabs
            class={styles.root}
            orientation="vertical"
            value={props.value}
            defaultValue={props.defaultValue}
            onChange={props.onChange}
        >
            {props.children}
        </KobalteTabs>
    );
}

export function TabList(props: ParentProps<{ class?: string }>): JSX.Element {
    return (
        <KobalteTabs.List class={`${styles.list} ${props.class ?? ""}`} data-label="List of tabs">
            {props.children}
        </KobalteTabs.List>
    );
}

type TabChildren = JSX.Element | ((state: { selected: boolean }) => JSX.Element);

export function Tab(props: {
    value: string;
    disabled?: boolean;
    class?: string;
    as?: string;
    children: TabChildren;
}): JSX.Element {
    return (
        <KobalteTabs.Trigger as={props.as} class={`${styles.trigger} ${props.class ?? ""}`} value={props.value} disabled={props.disabled} data-label="Tab">
            {props.children}
        </KobalteTabs.Trigger>
    );
}

export function TabContent(props: ParentProps<{ value: string }>): JSX.Element {
    return (
        <KobalteTabs.Content class={styles.content} value={props.value} data-label="Tab content">
            {props.children}
        </KobalteTabs.Content>
    );
}
