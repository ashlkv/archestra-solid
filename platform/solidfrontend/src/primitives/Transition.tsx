import { children, createEffect, createSignal, type JSX, on, onCleanup, Show } from "solid-js";

interface TransitionProps {
    /** Reactive boolean controlling whether children are shown. */
    when: boolean;
    /** Called when the element enters the DOM. Call `done` when animation finishes. */
    onEnter?: (el: Element, done: () => void) => void;
    /** Called before the element is removed from the DOM. Call `done` to remove it. */
    onExit?: (el: Element, done: () => void) => void;
    children: JSX.Element;
}

/**
 * SSR-safe transition primitive using the Web Animations API.
 *
 * Unlike solid-transition-group, this component has no SSR/hydration issues
 * because it uses standard Solid primitives (<Show>, createEffect) with no
 * DOM-resolving internals that diverge between server and client.
 *
 * On enter: renders children, then calls onEnter with the resolved element.
 * On exit: calls onExit, waits for done(), then removes children from DOM.
 */
export function Transition(props: TransitionProps): JSX.Element {
    // `visible` stays true during exit animation so the element remains in DOM.
    const [visible, setVisible] = createSignal(props.when);
    const [entering, setEntering] = createSignal(false);

    const resolved = children(() => <Show when={visible()}>{props.children}</Show>);

    createEffect(
        on(
            () => props.when,
            (show) => {
                if (show) {
                    // Enter: make visible, then animate after DOM paint.
                    setVisible(true);
                    setEntering(true);
                } else if (visible()) {
                    // Exit: animate, then remove.
                    const el = getFirstElement(resolved());
                    if (el && props.onExit) {
                        props.onExit(el, () => setVisible(false));
                    } else {
                        setVisible(false);
                    }
                }
            },
        ),
    );

    // Run enter animation after the element is painted.
    createEffect(
        on(entering, (isEntering) => {
            if (!isEntering) return;
            setEntering(false);

            // Use queueMicrotask to ensure the DOM has the element before animating.
            queueMicrotask(() => {
                const el = getFirstElement(resolved());
                if (el && props.onEnter) {
                    props.onEnter(el, () => {});
                }
            });
        }),
    );

    // If the component unmounts during an exit animation, force cleanup.
    onCleanup(() => setVisible(false));

    return <>{resolved()}</>;
}

function getFirstElement(node: JSX.Element): Element | null {
    if (node instanceof Element) return node;
    if (Array.isArray(node)) {
        for (const child of node) {
            const el = getFirstElement(child);
            if (el) return el;
        }
    }
    return null;
}
