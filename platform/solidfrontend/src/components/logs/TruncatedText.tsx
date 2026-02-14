import { type JSX, Show } from "solid-js";
import { Tooltip } from "@/components/primitives/Tooltip";

export function TruncatedText(props: { message: string | undefined; maxLength?: number }): JSX.Element {
    const maxLen = () => props.maxLength ?? 50;
    const isTruncated = () => (props.message?.length ?? 0) > maxLen();
    const displayText = () => {
        if (!props.message) return "";
        return isTruncated() ? `${props.message.slice(0, maxLen())}...` : props.message;
    };

    return (
        <>
            <Show when={!props.message}>
                <span style={{ color: "var(--muted-foreground)" }}>No message</span>
            </Show>
            <Show when={props.message && isTruncated()}>
                <Tooltip content={props.message!}>
                    <span style={{ "white-space": "nowrap", overflow: "hidden", "text-overflow": "ellipsis" }}>
                        {displayText()}
                    </span>
                </Tooltip>
            </Show>
            <Show when={props.message && !isTruncated()}>
                <span style={{ "white-space": "nowrap" }}>{displayText()}</span>
            </Show>
        </>
    );
}
