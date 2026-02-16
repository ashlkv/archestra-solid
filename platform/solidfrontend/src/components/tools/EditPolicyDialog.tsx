import { type JSX, Show } from "solid-js";
import { Dialog, DialogContent } from "@/components/primitives/Dialog";
import { useTools } from "@/lib/tool.query";
import styles from "./EditPolicyDialog.module.css";
import { ToolCallPolicies } from "./ToolCallPolicies";
import { ToolName } from "./ToolName";
import { ToolResultPolicies } from "./ToolResultPolicies";

export function EditPolicyDialog(props: {
    toolName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}): JSX.Element {
    const { data: tools } = useTools(() => ({ limit: 10, offset: 0, search: shortName(props.toolName) }));

    const tool = () => tools()?.find((t) => t.name === props.toolName);

    return (
        <Dialog open={props.open} onOpenChange={props.onOpenChange}>
            <DialogContent title="Edit policies" size="large">
                <Show when={tool()}>
                    <div class={styles.content}>
                        <div class={styles.toolHeader}>
                            <ToolName
                                name={props.toolName}
                                tool={{ description: tool()?.description, parameters: tool()?.parameters }}
                            />
                        </div>
                        <ToolCallPolicies tool={{ id: tool()?.id, parameters: tool()?.parameters }} />
                        <ToolResultPolicies tool={{ id: tool()?.id }} />
                    </div>
                </Show>
                <Show when={!tool()}>
                    <p class={styles.fallback}>Tool not found.</p>
                </Show>
            </DialogContent>
        </Dialog>
    );
}

function shortName(name: string): string {
    const lastSep = name.lastIndexOf("__");
    return lastSep !== -1 ? name.slice(lastSep + 2) : name;
}
