import { Separator as KobalteSeparator } from "@kobalte/core/separator";
import type { JSX } from "solid-js";
import styles from "./Separator.module.css";

type Props = {
    class?: string;
};

export function Separator(props: Props): JSX.Element {
    return <KobalteSeparator class={`${styles.separator} ${props.class ?? ""}`} />;
}
