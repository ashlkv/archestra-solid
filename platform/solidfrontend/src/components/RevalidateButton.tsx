import { navigate } from "astro:transitions/client";

/**
 * Example component showing how to revalidate after a mutation.
 * Call revalidate() after any successful mutation to refresh server data.
 */
export function revalidate() {
    navigate(window.location.href);
}

/**
 * Simple button to manually refresh the page data.
 */
export function RevalidateButton() {
    return (
        <button type="button" onClick={() => revalidate()}>
            Refresh
        </button>
    );
}
