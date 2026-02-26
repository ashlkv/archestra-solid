// @refresh reload
import "solid-devtools";
import { mount, StartClient } from "@solidjs/start/client";

// Suppress benign "ResizeObserver loop completed with undelivered notifications" errors.
// This occurs when ResizeObserver callbacks trigger layout changes that can't all be
// delivered in a single animation frame — harmless in practice and common with libraries
// like CodeMirror and Kobalte that use ResizeObserver internally.
const RESIZE_OBSERVER_ERROR = "ResizeObserver loop completed with undelivered notifications.";
window.addEventListener("error", (e) => {
    if (e.message === RESIZE_OBSERVER_ERROR) {
        e.stopImmediatePropagation();
        e.preventDefault();
    }
});

mount(() => <StartClient />, document.getElementById("app")!);
