import { type JSX, Show } from "solid-js";
import { Dialog, DialogContent } from "@/components/primitives/Dialog";
import { useResultPolicies, useToolCallPolicies } from "@/lib/policy.query";
import { useTools } from "@/lib/tool.query";
import type { CallPolicy, ResultPolicy, ResultPolicyAction } from "@/types";
import { CallPolicyToggle } from "./CallPolicyToggle";
import styles from "./EditPolicyDialog.module.css";
import { ResultPolicySelect } from "./ResultPolicySelect";
import { ToolName } from "./ToolName";

type CallPolicyAction = CallPolicy["action"];

export function EditPolicyDialog(props: {
    toolName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}): JSX.Element {
    const { data: tools } = useTools(() => ({ limit: 10, offset: 0, search: shortName(props.toolName) }));
    const { data: callPolicies } = useToolCallPolicies();
    const { data: resultPolicies } = useResultPolicies();

    const tool = () => tools()?.find((t) => t.name === props.toolName);
    const callPolicy = () => findCallPolicy(tool()?.id, callPolicies());
    const resultPolicy = () => findResultPolicy(tool()?.id, resultPolicies());

    return (
        <Dialog open={props.open} onOpenChange={props.onOpenChange}>
            <DialogContent title="Edit Policies" size="small">
                <Show when={tool()} fallback={<p class={styles.fallback}>Tool not found.</p>}>
                    <div class={styles.content}>
                        <div class={styles.toolHeader}>
                            <ToolName
                                name={props.toolName}
                                tool={{ description: tool()!.description, parameters: tool()!.parameters }}
                            />
                        </div>
                        <div class={styles.field}>
                            <label class={styles.label}>Call policy</label>
                            <CallPolicyToggle
                                toolId={tool()!.id}
                                policyId={callPolicy()?.id}
                                value={callPolicy()?.action}
                            />
                        </div>
                        <div class={styles.field}>
                            <label class={styles.label}>Result policy</label>
                            <ResultPolicySelect
                                toolId={tool()!.id}
                                policyId={resultPolicy()?.id}
                                value={resultPolicy()?.action}
                            />
                        </div>
                    </div>
                </Show>
            </DialogContent>
        </Dialog>
    );
}

function shortName(name: string): string {
    const lastSep = name.lastIndexOf("__");
    return lastSep !== -1 ? name.slice(lastSep + 2) : name;
}

function findCallPolicy(
    toolId: string | undefined,
    policies: CallPolicy[] | undefined,
): { id: string; action: CallPolicyAction } | undefined {
    if (!toolId || !policies) return undefined;
    const p = policies.find((p) => p.toolId === toolId && p.conditions.length === 0);
    return p ? { id: p.id, action: p.action } : undefined;
}

function findResultPolicy(
    toolId: string | undefined,
    policies: ResultPolicy[] | undefined,
): { id: string; action: ResultPolicyAction } | undefined {
    if (!toolId || !policies) return undefined;
    const p = policies.find((p) => p.toolId === toolId && p.conditions.length === 0);
    return p ? { id: p.id, action: p.action } : undefined;
}
