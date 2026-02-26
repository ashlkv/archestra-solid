import type { JSX } from "solid-js";
import { Transition } from "@/components/primitives/Transition";

interface ExpandCollapseTransitionProps {
    /** Reactive boolean controlling whether children are shown. */
    when: boolean;
    /** Animation duration in ms. Defaults to 200. */
    duration?: number;
    /**
     * CSS selector to find the animatable wrapper element relative to the
     * transition root. When omitted the root element itself is animated.
     */
    wrapperSelector?: string;
    children: JSX.Element;
}

export function ExpandCollapseTransition(props: ExpandCollapseTransitionProps): JSX.Element {
    const duration = () => props.duration ?? EXPAND_DURATION;

    const resolveWrapper = (el: Element): HTMLElement | null => {
        if (props.wrapperSelector) {
            return el.querySelector<HTMLElement>(props.wrapperSelector);
        }
        return el instanceof HTMLElement ? el : null;
    };

    const onEnter = (el: Element, done: () => void) => {
        animateExpand(el, done, resolveWrapper, duration());
    };

    const onExit = (el: Element, done: () => void) => {
        animateCollapse(el, done, resolveWrapper, duration());
    };

    return (
        <Transition when={props.when} onEnter={onEnter} onExit={onExit}>
            {props.children}
        </Transition>
    );
}

// --- Internal helpers ---

const EXPAND_DURATION = 200;

/** Track active ResizeObservers so collapse can clean them up. */
const activeObservers = new WeakMap<Element, ResizeObserver>();

function animateExpand(
    el: Element,
    done: () => void,
    resolveWrapper: (el: Element) => HTMLElement | null,
    duration: number,
): void {
    const wrapper = resolveWrapper(el);
    if (!wrapper) {
        done();
        return;
    }

    // Animate from 0 to current content height.
    const height = wrapper.scrollHeight;
    wrapper.animate(
        [
            { height: "0px", opacity: 0 },
            { height: `${height}px`, opacity: 1 },
        ],
        { duration, easing: "ease-out" },
    );

    // Watch for content height changes (e.g. Suspense resolving) and animate them.
    let prevHeight = height;
    let resizeAnimation: Animation | undefined;
    const observer = new ResizeObserver(() => {
        // Defer to next frame to avoid "ResizeObserver loop completed with
        // undelivered notifications" when the animation triggers further layout.
        requestAnimationFrame(() => {
            const newHeight = wrapper.scrollHeight;
            if (newHeight === prevHeight) return;

            resizeAnimation?.cancel();
            resizeAnimation = wrapper.animate([{ height: `${prevHeight}px` }, { height: `${newHeight}px` }], {
                duration,
                easing: "ease-out",
            });
            prevHeight = newHeight;
        });
    });
    observer.observe(wrapper);
    activeObservers.set(el, observer);

    done();
}

function animateCollapse(
    el: Element,
    done: () => void,
    resolveWrapper: (el: Element) => HTMLElement | null,
    duration: number,
): void {
    // Clean up resize observer.
    const observer = activeObservers.get(el);
    if (observer) {
        observer.disconnect();
        activeObservers.delete(el);
    }

    const wrapper = resolveWrapper(el);
    if (!wrapper) {
        done();
        return;
    }

    const height = wrapper.scrollHeight;
    const animation = wrapper.animate(
        [
            { height: `${height}px`, opacity: 1 },
            { height: "0px", opacity: 0 },
        ],
        { duration, easing: "ease-in" },
    );
    animation.finished.then(done);
}
