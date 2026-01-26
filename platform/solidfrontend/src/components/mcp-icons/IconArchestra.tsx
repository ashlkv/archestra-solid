import type { JSX } from "solid-js";

type Props = { size?: number; class?: string };

export function IconArchestra(props: Props): JSX.Element {
    return (
        <img
            src="https://archestra.ai/logo_square.png"
            alt="Archestra"
            class={props.class}
        />
    );
}
