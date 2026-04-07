import { For, type JSX, onMount } from "solid-js";

const SKELETON_ROWS = [
    { align: "flex-end" as const, width: "40%" },
    { align: "flex-start" as const, width: "70%" },
    { align: "flex-start" as const, width: "55%" },
    { align: "flex-end" as const, width: "35%" },
    { align: "flex-start" as const, width: "60%" },
];

export function ChatSkeleton(): JSX.Element {
    return (
        <div
            style={{
                display: "flex",
                "flex-direction": "column",
                gap: "1.5rem",
                padding: "1rem",
                "max-width": "48rem",
                width: "100%",
                margin: "0 auto",
            }}
            data-label="Chat skeleton"
        >
            <For each={SKELETON_ROWS}>
                {(row) => (
                    <div
                        style={{ display: "flex", "flex-direction": "column", "align-items": row.align, gap: "0.5rem" }}
                    >
                        <SkeletonBar width="60px" />
                        <SkeletonBar width={row.width} />
                    </div>
                )}
            </For>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Internal
// ---------------------------------------------------------------------------

function SkeletonBar(props: { width: string }): JSX.Element {
    let ref!: HTMLDivElement;

    onMount(() => {
        ref.animate([{ opacity: 1 }, { opacity: 0.4 }, { opacity: 1 }], {
            duration: 1500,
            iterations: Number.POSITIVE_INFINITY,
            easing: "ease-in-out",
        });
    });

    return (
        <div
            ref={ref}
            style={{
                width: props.width,
                height: "14px",
                "border-radius": "8px",
                "background-color": "var(--border)",
            }}
        />
    );
}
