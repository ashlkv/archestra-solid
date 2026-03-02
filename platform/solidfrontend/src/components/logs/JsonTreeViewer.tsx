import { createEffect, createSignal, For, type JSX, on, Show } from "solid-js";
import { ChevronRight } from "@/components/icons";
import { CopyButton } from "@/components/primitives/CopyButton";
import styles from "./JsonTreeViewer.module.css";

const STRING_COLLAPSE_THRESHOLD = 40;

export function JsonTreeViewer(props: {
    data: unknown;
    defaultExpandDepth?: number;
    expandGeneration?: number;
    collapseGeneration?: number;
}): JSX.Element {
    const defaultDepth = () => props.defaultExpandDepth ?? 1;
    const [expandState, setExpandState] = createSignal<Map<string, boolean>>(new Map(), {
        name: "expandState",
    });
    const [hoveredPath, setHoveredPath] = createSignal<string | undefined>(undefined, {
        name: "hoveredPath",
    });

    createEffect(
        on(
            () => props.expandGeneration,
            (generation, previousGeneration) => {
                if (generation === undefined || generation === previousGeneration) return;
                const paths = collectPaths(props.data, "$");
                const next = new Map<string, boolean>();
                for (const path of paths) {
                    next.set(path, true);
                }
                setExpandState(next);
            },
        ),
    );

    createEffect(
        on(
            () => props.collapseGeneration,
            (generation, previousGeneration) => {
                if (generation === undefined || generation === previousGeneration) return;
                const paths = collectPaths(props.data, "$");
                const next = new Map<string, boolean>();
                for (const path of paths) {
                    next.set(path, false);
                }
                setExpandState(next);
            },
        ),
    );

    const isExpanded = (path: string, depth: number): boolean => {
        const explicit = expandState().get(path);
        if (explicit !== undefined) return explicit;
        return depth < defaultDepth();
    };

    const toggleExpanded = (path: string, depth: number) => {
        const current = isExpanded(path, depth);
        setExpandState((previous) => {
            const next = new Map(previous);
            next.set(path, !current);
            return next;
        });
    };

    return (
        <div class={styles.container} data-label="JsonTreeViewer">
            <JsonNode
                value={props.data}
                path="$"
                depth={0}
                isExpanded={isExpanded}
                toggleExpanded={toggleExpanded}
                hoveredPath={hoveredPath}
                setHoveredPath={setHoveredPath}
            />
        </div>
    );
}

function JsonNode(props: {
    value: unknown;
    path: string;
    depth: number;
    keyName?: string;
    isLast?: boolean;
    isExpanded: (path: string, depth: number) => boolean;
    toggleExpanded: (path: string, depth: number) => void;
    hoveredPath: () => string | undefined;
    setHoveredPath: (path: string | undefined) => void;
}): JSX.Element {
    const isLast = () => props.isLast !== false;
    const comma = () => (isLast() ? "" : ",");

    const isCompound = () => {
        const value = props.value;
        return value !== null && typeof value === "object";
    };

    const isHighlighted = () => isCompound() && props.hoveredPath() === props.path;

    const onMouseEnter = (event: MouseEvent) => {
        event.stopPropagation();
        props.setHoveredPath(props.path);
    };

    const onMouseLeave = (event: MouseEvent) => {
        event.stopPropagation();
        if (props.hoveredPath() === props.path) {
            props.setHoveredPath(undefined);
        }
    };

    const keyPrefix = (): JSX.Element => (
        <Show when={props.keyName !== undefined}>
            <span class={styles["property-name"]}>"{props.keyName}"</span>
            <span class={styles.punctuation}>: </span>
        </Show>
    );

    // Primitive values
    const renderPrimitive = (): JSX.Element => {
        const value = props.value;
        if (value === null) {
            return (
                <div>
                    {keyPrefix()}
                    <span class={styles.null}>null</span>
                    {comma()}
                </div>
            );
        }
        if (typeof value === "string") {
            const escaped = escapeString(value);
            const isLong = escaped.length > STRING_COLLAPSE_THRESHOLD;
            const expanded = () => isLong && props.isExpanded(props.path, props.depth);

            if (!isLong) {
                return (
                    <div>
                        {keyPrefix()}
                        <span class={styles.string}>"{escaped}"</span>
                        {comma()}
                    </div>
                );
            }

            return (
                <div>
                    <button
                        type="button"
                        class={styles.toggle}
                        onClick={() => props.toggleExpanded(props.path, props.depth)}
                    >
                        <ChevronRight
                            size={14}
                            class={`${styles.chevron} ${expanded() ? styles["chevron-expanded"] : ""}`}
                        />
                    </button>
                    {keyPrefix()}
                    <Show when={expanded()}>
                        <span class={`${styles.string} ${styles["string-expanded"]}`}>"{escaped}"</span>
                        {comma()}
                    </Show>
                    <Show when={!expanded()}>
                        <button
                            type="button"
                            class={`${styles.toggle} ${styles.preview}`}
                            onClick={() => props.toggleExpanded(props.path, props.depth)}
                        >
                            <span class={styles.string}>"{escaped.slice(0, STRING_COLLAPSE_THRESHOLD)}</span>
                            <span class={`${styles.toggle} ${styles.preview}`}> ... {escaped.length} chars </span>
                        </button>
                        {comma()}
                    </Show>
                </div>
            );
        }
        if (typeof value === "number") {
            return (
                <div>
                    {keyPrefix()}
                    <span class={styles.number}>{String(value)}</span>
                    {comma()}
                </div>
            );
        }
        if (typeof value === "boolean") {
            return (
                <div>
                    {keyPrefix()}
                    <span class={styles.boolean}>{String(value)}</span>
                    {comma()}
                </div>
            );
        }
        return (
            <div>
                {keyPrefix()}
                <span>{String(value)}</span>
                {comma()}
            </div>
        );
    };

    // Compound values (object/array)
    const renderCompound = (): JSX.Element => {
        const value = props.value as Record<string, unknown> | unknown[];
        const isArray = Array.isArray(value);
        const openBracket = isArray ? "[" : "{";
        const closeBracket = isArray ? "]" : "}";
        const entries = isArray
            ? value.map((item, index) => ({ key: String(index), value: item }))
            : Object.entries(value).map(([key, val]) => ({ key, value: val }));
        const count = entries.length;
        const expanded = () => props.isExpanded(props.path, props.depth);
        const preview = () => (isArray ? `${count} items` : `${count} keys`);

        return (
            // biome-ignore lint/a11y/noStaticElementInteractions: hover highlight for copy affordance, not interactive
            <div
                class={`${styles.node} ${isHighlighted() ? styles["node-highlighted"] : ""}`}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <Show when={isHighlighted()}>
                    <div class={styles["copy-wrapper"]}>
                        <CopyButton text={JSON.stringify(props.value, null, 2)} size="icon-small" />
                    </div>
                </Show>
                <div>
                    <button
                        type="button"
                        class={styles.toggle}
                        onClick={() => props.toggleExpanded(props.path, props.depth)}
                    >
                        <ChevronRight
                            size={14}
                            class={`${styles.chevron} ${expanded() ? styles["chevron-expanded"] : ""}`}
                        />
                    </button>
                    {keyPrefix()}
                    <span class={styles.punctuation}>{openBracket}</span>
                    <Show when={!expanded()}>
                        <button
                            type="button"
                            class={`${styles.toggle} ${styles.preview}`}
                            onClick={() => props.toggleExpanded(props.path, props.depth)}
                        >
                            {" "}
                            ... {preview()}{" "}
                        </button>
                        <span class={styles.punctuation}>{closeBracket}</span>
                        {comma()}
                    </Show>
                </div>
                <Show when={expanded()}>
                    <div class={styles.children}>
                        <For each={entries}>
                            {(entry, index) => (
                                <JsonNode
                                    value={entry.value}
                                    path={`${props.path}.${entry.key}`}
                                    depth={props.depth + 1}
                                    keyName={isArray ? undefined : entry.key}
                                    isLast={index() === entries.length - 1}
                                    isExpanded={props.isExpanded}
                                    toggleExpanded={props.toggleExpanded}
                                    hoveredPath={props.hoveredPath}
                                    setHoveredPath={props.setHoveredPath}
                                />
                            )}
                        </For>
                    </div>
                    <div>
                        <span class={styles.punctuation}>{closeBracket}</span>
                        {comma()}
                    </div>
                </Show>
            </div>
        );
    };

    return (
        <>
            <Show when={isCompound()}>{renderCompound()}</Show>
            <Show when={!isCompound()}>{renderPrimitive()}</Show>
        </>
    );
}

function collectPaths(value: unknown, prefix: string): string[] {
    const paths: string[] = [];
    if (typeof value === "string" && escapeString(value).length > STRING_COLLAPSE_THRESHOLD) {
        paths.push(prefix);
    } else if (value !== null && typeof value === "object") {
        paths.push(prefix);
        const entries = Array.isArray(value)
            ? value.map((item, index) => ({ key: String(index), value: item }))
            : Object.entries(value).map(([key, val]) => ({ key, value: val }));
        for (const entry of entries) {
            paths.push(...collectPaths(entry.value, `${prefix}.${entry.key}`));
        }
    }
    return paths;
}

function escapeString(value: string): string {
    return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\t/g, "\\t");
}
