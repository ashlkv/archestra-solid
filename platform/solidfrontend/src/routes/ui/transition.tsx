import { createSignal, type JSX } from "solid-js";
import { UiLayout } from "@/components/ui-demo/UiLayout";
import { Transition } from "@/components/primitives/Transition";
import { Button } from "@/components/primitives/Button";

function fadeIn(element: Element, done: () => void) {
    element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: "ease-out" }).onfinish = done;
}

function fadeOut(element: Element, done: () => void) {
    element.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: "ease-in" }).onfinish = done;
}

function slideIn(element: Element, done: () => void) {
    element.animate(
        [
            { opacity: 0, transform: "translateY(-10px)" },
            { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 300, easing: "ease-out" },
    ).onfinish = done;
}

function slideOut(element: Element, done: () => void) {
    element.animate(
        [
            { opacity: 1, transform: "translateY(0)" },
            { opacity: 0, transform: "translateY(-10px)" },
        ],
        { duration: 300, easing: "ease-in" },
    ).onfinish = done;
}

function scaleIn(element: Element, done: () => void) {
    element.animate(
        [
            { opacity: 0, transform: "scale(0.9)" },
            { opacity: 1, transform: "scale(1)" },
        ],
        { duration: 250, easing: "ease-out" },
    ).onfinish = done;
}

function scaleOut(element: Element, done: () => void) {
    element.animate(
        [
            { opacity: 1, transform: "scale(1)" },
            { opacity: 0, transform: "scale(0.9)" },
        ],
        { duration: 250, easing: "ease-in" },
    ).onfinish = done;
}

export default function TransitionDemo(): JSX.Element {
    const [showFade, setShowFade] = createSignal(true);
    const [showSlide, setShowSlide] = createSignal(true);
    const [showScale, setShowScale] = createSignal(true);
    const [showNoAnimation, setShowNoAnimation] = createSignal(true);

    const boxStyle: JSX.CSSProperties = {
        padding: "1rem",
        background: "var(--muted)",
        "border-radius": "0.5rem",
        border: "1px solid var(--border)",
        "margin-top": "0.5rem",
    };

    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="TransitionDemo">
                <h2>Transition</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    SSR-safe transition primitive using the Web Animations API. Controls enter/exit animations via
                    callback functions. The element stays in the DOM during exit until the done callback is called.
                </p>

                <section data-label="Fade transition">
                    <h3>Fade</h3>
                    <Button variant="outline" size="small" onClick={() => setShowFade(!showFade())} data-label="Toggle fade">
                        {showFade() ? "Hide" : "Show"}
                    </Button>
                    <Transition when={showFade()} onEnter={fadeIn} onExit={fadeOut}>
                        <div style={boxStyle} data-label="Fade content">
                            This content fades in and out.
                        </div>
                    </Transition>
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="Slide transition">
                    <h3>Slide</h3>
                    <Button variant="outline" size="small" onClick={() => setShowSlide(!showSlide())} data-label="Toggle slide">
                        {showSlide() ? "Hide" : "Show"}
                    </Button>
                    <Transition when={showSlide()} onEnter={slideIn} onExit={slideOut}>
                        <div style={boxStyle} data-label="Slide content">
                            This content slides down on enter and up on exit.
                        </div>
                    </Transition>
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="Scale transition">
                    <h3>Scale</h3>
                    <Button variant="outline" size="small" onClick={() => setShowScale(!showScale())} data-label="Toggle scale">
                        {showScale() ? "Hide" : "Show"}
                    </Button>
                    <Transition when={showScale()} onEnter={scaleIn} onExit={scaleOut}>
                        <div style={boxStyle} data-label="Scale content">
                            This content scales in and out.
                        </div>
                    </Transition>
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="No animation">
                    <h3>No animation (instant)</h3>
                    <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.5rem" }}>
                        Without onEnter/onExit callbacks, the element appears and disappears instantly.
                    </p>
                    <Button
                        variant="outline"
                        size="small"
                        onClick={() => setShowNoAnimation(!showNoAnimation())}
                        data-label="Toggle instant"
                    >
                        {showNoAnimation() ? "Hide" : "Show"}
                    </Button>
                    <Transition when={showNoAnimation()}>
                        <div style={boxStyle} data-label="Instant content">
                            This content has no animation.
                        </div>
                    </Transition>
                </section>
            </div>
        </UiLayout>
    );
}
