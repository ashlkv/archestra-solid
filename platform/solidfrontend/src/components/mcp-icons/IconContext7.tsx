import type { JSX } from "solid-js";

type Props = { size?: number; class?: string; title?: string };

export function IconContext7(props: Props): JSX.Element {
    return (
        <img
            src="https://avatars.githubusercontent.com/u/74989412?s=96&v=4"
            alt="Context7"
            title={props.title}
            class={props.class}
        />
    );
}
