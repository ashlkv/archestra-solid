import type { JSX } from "solid-js";
import { Clock } from "@/components/icons";
import { formatDate } from "@/lib/interaction.utils";
import { Badge } from "./Badge";

interface Props {
    date: string;
    class?: string;
}

export function TimestampBadge(props: Props): JSX.Element {
    return (
        <Badge class={props.class}>
            <Clock style={{ width: "12px", height: "12px", "flex-shrink": "0" }} />
            {formatDate(props.date)}
        </Badge>
    );
}
