import type { JSX } from "solid-js";

type Props = { size?: number; class?: string };

export function IconClaudeCode(props: Props): JSX.Element {
    const size = () => props.size ?? 24;
    return (
        <svg
            width={size()}
            height={size()}
            viewBox="37 22 108 85"
            fill="#D97757"
            xmlns="http://www.w3.org/2000/svg"
            class={props.class}
            style="fill-rule:evenodd;clip-rule:evenodd"
        >
            <path d="M58.5,104.25l-9.75,0l0,-39.75l-9,0l0,-20.25l9,0l0,-20.25l84,0l0,20.25l9,0l0,20.25l-9,0l0,39.75l-9.75,0l0,-20.25l-9,0l0,20.25l-9,0l0,-19.5l-28.5,0l0,19.5l-9,0l0,-20.25l-9,0l0,20.25Zm64.5,-60l-9,0l0,9.75l9,0l0,-9.75Zm-55.5,0l-9,0l0,9.75l9,0l0,-9.75Z" />
        </svg>
    );
}
