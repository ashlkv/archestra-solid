import type { JSX } from "solid-js";

type Props = { size?: number; class?: string };

export function IconPlaywright(props: Props): JSX.Element {
    return (
        <img
            src="https://avatars.githubusercontent.com/u/6154722?s=96&v=4"
            alt="Playwright"
            class={props.class}
        />
    );
}
