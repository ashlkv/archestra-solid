import { Ban, Check, Handshake } from "@/components/icons";
import { createEffect, createSignal, For, type JSX } from "solid-js";
import type { CallPolicy } from "@/types";
import { useSaveCallPolicy } from "@/lib/policy.query";
import { showError } from "../primitives/Toast";
import { ToggleGroup, ToggleItem } from "../primitives/ToggleGroup";
import { CALL_POLICY_ACTION_OPTIONS } from "./tool.utils";

type PolicyAction = CallPolicy["action"]

const MIN_LOADER_DURATION = 400;

const ICONS: Record<PolicyAction, JSX.Element> = {
    allow_when_context_is_untrusted: <Check size={14} />,
    block_when_context_is_untrusted: <Handshake size={14} />,
    block_always: <Ban size={14} />,
};

export function CallPolicyToggle(props: {
    toolId: string;
    policyId: string | undefined;
    value: PolicyAction | undefined;
    disabled?: boolean;
}): JSX.Element {
    const [selected, setSelected] = createSignal(props.value);
    const [pendingAction, setPendingAction] = createSignal<PolicyAction | null>(null);
    const { submission, submit } = useSaveCallPolicy(props.policyId);

    createEffect(() => {
        setSelected(props.value);
    });

    const onClick = (action: PolicyAction) => async () => {
        if (selected() === action || pendingAction()) return;
        const previousValue = selected();
        setPendingAction(action);
        setSelected(action);
        const startTime = Date.now();
        try {
            await submit({ toolId: props.toolId, policy: { id: props.policyId, action, conditions: [], reason: null } });
        } catch (exception) {
            setSelected(previousValue);
            showError(exception instanceof Error ? exception.message : "Failed to save policy");
        } finally {
            const elapsed = Date.now() - startTime;
            if (elapsed < MIN_LOADER_DURATION) {
                await new Promise((resolve) => setTimeout(resolve, MIN_LOADER_DURATION - elapsed));
            }
            setPendingAction(null);
        }
    };

    const isDisabled = () => props.disabled || submission.pending;

    return (
        <ToggleGroup>
            <For each={CALL_POLICY_ACTION_OPTIONS}>
                {(option) => (
                    <ToggleItem
                        tooltip={option.tooltip}
                        selected={selected() === option.value}
                        loading={pendingAction() === option.value}
                        disabled={isDisabled()}
                        onClick={onClick(option.value)}
                    >
                        {ICONS[option.value]}
                    </ToggleItem>
                )}
            </For>
        </ToggleGroup>
    );
}
