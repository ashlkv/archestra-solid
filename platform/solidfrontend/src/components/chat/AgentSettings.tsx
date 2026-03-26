import type { SupportedProvider } from "@shared";
import { createEffect, createSignal, For, type JSX, on, Show } from "solid-js";
import { TextInput } from "@/components/common/TextInput";
import { providerDisplayNames } from "@shared";
import { ArrowRight, ChevronDown, Check, Info, Key, Loader2 } from "@/components/icons";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/primitives/HoverCard";
import { ProviderModelBadge } from "@/components/primitives/ProviderModelBadge";
import { Button } from "@/components/primitives/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/primitives/Popover";
import { RadioGroupCustom, RadioGroupItem } from "@/components/primitives/RadioGroup";
import { useAgent, useAgents, useUpdateAgent } from "@/lib/agent.query";
import { useAvailableChatApiKeys } from "@/lib/chat-api-keys.query";
import { useChatModels } from "@/lib/chat-models.query";
import type { ChatApiKey, ChatModel } from "@/types";
import { AgentToolsEditor } from "./AgentToolsEditor";
import { LlmSelectorGroup } from "./LlmSelectorGroup";
import styles from "./AgentSettings.module.css";

export function AgentSettings(props: {
    agentId: string;
    onAgentChange: (agentId: string) => void;
    disabled?: boolean;
}): JSX.Element {
    const { data: agent, query: agentQuery } = useAgent(() => props.agentId);
    const { data: agents } = useAgents(undefined as undefined);
    const { submit: updateAgent } = useUpdateAgent();

    const agentOptions = () =>
        (agents() ?? []).map((a) => ({ value: a.id, label: a.name }));

    // Local form state
    const [localName, setLocalName] = createSignal("", { name: "localName" });
    const [localDescription, setLocalDescription] = createSignal("", { name: "localDescription" });
    const [localSystemPrompt, setLocalSystemPrompt] = createSignal("", { name: "localSystemPrompt" });
    const [localApiKeyId, setLocalApiKeyId] = createSignal<string | undefined>(undefined, { name: "localApiKeyId" });
    const [localModel, setLocalModel] = createSignal<string | undefined>(undefined, { name: "localModel" });
    const [isDynamic, setIsDynamic] = createSignal(true, { name: "isDynamic" });

    // Sync from server once per agent ID (initial load or agent switch).
    // Subsequent refetches (e.g. from tool assign/unassign) must not overwrite
    // local state that the user is actively editing.
    let syncedForAgentId: string | undefined;
    createEffect(() => {
        const agentData = agent();
        if (!agentData) return;
        if (syncedForAgentId === props.agentId) return;
        syncedForAgentId = props.agentId;
        setLocalName(agentData.name);
        setLocalDescription(agentData.description ?? "");
        setLocalSystemPrompt(agentData.systemPrompt ?? "");
        setLocalApiKeyId(agentData.llmApiKeyId ?? undefined);
        setLocalModel(agentData.llmModel ?? undefined);
        setIsDynamic(!agentData.llmApiKeyId);
    });

    // Save field on blur
    const saveField = (field: string, value: string | null) => {
        const agentData = agent();
        if (!agentData) return;
        updateAgent({ id: props.agentId, [field]: value });
    };

    // LLM config helpers
    const { data: chatModels } = useChatModels(undefined as undefined);
    const { data: availableKeys } = useAvailableChatApiKeys(undefined as undefined);

    const selectedModelProvider = (): SupportedProvider | undefined => {
        const modelId = localModel();
        if (!modelId) return undefined;
        return (chatModels() ?? []).find((m: ChatModel) => m.id === modelId)?.provider;
    };

    const selectedKeyProvider = (): SupportedProvider | undefined => {
        const keyId = localApiKeyId();
        if (!keyId) return undefined;
        return (availableKeys() ?? []).find((k: ChatApiKey) => k.id === keyId)?.provider;
    };

    const onApiKeyChange = (keyId: string) => {
        setLocalApiKeyId(keyId);
        const keys = availableKeys() ?? [];
        const key = keys.find((k: ChatApiKey) => k.id === keyId);
        if (!key) return;

        // Auto-select model for this provider
        const models = chatModels() ?? [];
        if (selectedModelProvider() !== key.provider) {
            const providerModels = models.filter((m: ChatModel) => m.provider === key.provider);
            if (providerModels.length > 0) {
                setLocalModel(providerModels[0].id);
                updateAgent({ id: props.agentId, llmApiKeyId: keyId, llmModel: providerModels[0].id });
                return;
            }
        }
        updateAgent({ id: props.agentId, llmApiKeyId: keyId, llmModel: localModel() ?? null });
    };

    const onModelChange = (modelId: string) => {
        setLocalModel(modelId);
        const models = chatModels() ?? [];
        const model = models.find((m: ChatModel) => m.id === modelId);
        if (!model) return;

        // Auto-select key for this provider if needed
        const currentKeyProvider = selectedKeyProvider();
        if (currentKeyProvider !== model.provider) {
            const keys = availableKeys() ?? [];
            const scopePriority = { personal: 0, team: 1, org_wide: 2 } as const;
            const providerKeys = keys
                .filter((k: ChatApiKey) => k.provider === model.provider)
                .sort(
                    (a: ChatApiKey, b: ChatApiKey) =>
                        ((scopePriority[a.scope] ?? 3) - (scopePriority[b.scope] ?? 3)),
                );
            if (providerKeys.length > 0) {
                setLocalApiKeyId(providerKeys[0].id);
                updateAgent({ id: props.agentId, llmApiKeyId: providerKeys[0].id, llmModel: modelId });
                return;
            }
        }
        updateAgent({ id: props.agentId, llmModel: modelId, llmApiKeyId: localApiKeyId() ?? null });
    };

    const onClearToDynamic = () => {
        updateAgent({ id: props.agentId, llmApiKeyId: null, llmModel: null });
    };

    const onRestoreFromDynamic = () => {
        const keyId = localApiKeyId();
        const model = localModel();
        if (keyId) {
            updateAgent({ id: props.agentId, llmApiKeyId: keyId, llmModel: model ?? null });
        }
    };

    const availableKeyCount = () => (availableKeys() ?? []).length;

    const dynamicLabel = () => {
        const count = availableKeyCount();
        if (count === 0) return "Choose dynamically";
        if (count === 1) return "Choose dynamically between 1 key";
        return `Choose dynamically between ${count} keys`;
    };

    return (
        <div class={styles.container} data-label="Agent settings">
            <Show when={agentQuery.pending}>
                <div class={styles.loading}>
                    <Loader2 size={14} class={styles.spinning} />
                    Loading...
                </div>
            </Show>

            <Show when={!agentQuery.pending && agent()}>
                {/* Name + Switch agent */}
                <div class={styles["name-row"]}>
                    <TextInput
                        value={localName()}
                        multiline={false}
                        disabled={props.disabled}
                        placeholder="Name"
                        onInput={setLocalName}
                        onBlur={() => {
                            if (localName().trim() && localName() !== agent()?.name) {
                                saveField("name", localName().trim());
                            }
                        }}
                    />
                    <SwitchAgentDropdown
                        currentAgentId={props.agentId}
                        onAgentChange={props.onAgentChange}
                        disabled={props.disabled}
                    />
                </div>

                {/* Description */}
                <div class={styles.section}>
                    <TextInput
                        value={localDescription()}
                        multiline
                        rows={2}
                        disabled={props.disabled}
                        placeholder="Description"
                        onInput={setLocalDescription}
                        onBlur={() => {
                            if (localDescription() !== (agent()?.description ?? "")) {
                                saveField("description", localDescription() || null);
                            }
                        }}
                    />
                </div>

                {/* System prompt */}
                <div class={styles.section}>
                    <TextInput
                        value={localSystemPrompt()}
                        multiline
                        rows={4}
                        disabled={props.disabled}
                        onInput={setLocalSystemPrompt}
                        onBlur={() => {
                            if (localSystemPrompt() !== (agent()?.systemPrompt ?? "")) {
                                saveField("systemPrompt", localSystemPrompt() || null);
                            }
                        }}
                        placeholder="Instruction"
                    />
                </div>

                {/* Tools */}
                <div class={styles.section}>
                    <label class={styles.label}>Available tools ({agent()!.tools.length})</label>
                    <AgentToolsEditor
                        agentId={props.agentId}
                        agentTools={agent()!.tools}
                        disabled={props.disabled}
                    />
                </div>

                {/* LLM Configuration */}
                <div class={styles.section}>
                    <label class={styles.label}>LLM configuration</label>
                    <RadioGroupCustom
                        value={isDynamic() ? "dynamic" : "specific"}
                        onChange={(value) => {
                            const dynamic = value === "dynamic";
                            setIsDynamic(dynamic);
                            if (dynamic) {
                                onClearToDynamic();
                            } else {
                                onRestoreFromDynamic();
                            }
                        }}
                        disabled={props.disabled}
                    >
                        <RadioGroupItem value="dynamic">
                            <span class={styles["dynamic-label"]}>
                                {dynamicLabel()}
                                <Show when={availableKeyCount() > 0}>
                                    <AvailableKeysTooltip keys={availableKeys() ?? []} />
                                </Show>
                            </span>
                        </RadioGroupItem>
                        <RadioGroupItem value="specific">
                            <LlmSelectorGroup
                                selectedKeyId={localApiKeyId()}
                                onKeyChange={onApiKeyChange}
                                currentProvider={selectedModelProvider()}
                                selectedModel={localModel() ?? ""}
                                onModelChange={onModelChange}
                                disabled={props.disabled || isDynamic()}
                                size="medium"
                                autoSelect={!isDynamic()}
                            />
                        </RadioGroupItem>
                    </RadioGroupCustom>
                </div>
            </Show>
        </div>
    );
}

// ---------------------------------------------------------------------------
// SwitchAgentDropdown
// ---------------------------------------------------------------------------

const SCOPE_LABELS: Record<string, string> = {
    personal: "me",
    team: "team",
    org_wide: "org",
};

function AvailableKeysTooltip(props: { keys: ChatApiKey[] }): JSX.Element {
    return (
        <HoverCard placement="bottom-start" openDelay={200}>
            <HoverCardTrigger>
                <Info size={14} class={styles["info-icon"]} />
            </HoverCardTrigger>
            <HoverCardContent>
                <div class={styles["keys-tooltip"]}>
                    <p class={styles["keys-tooltip-description"]}>
                        At the start of each conversation, the system picks an API key by priority: your personal keys
                        first, then team keys, then organization-wide keys. The model is determined by the first
                        available provider.
                    </p>
                    <For each={props.keys}>
                        {(apiKey) => (
                            <div class={styles["keys-tooltip-item"]}>
                                <Key size={12} />
                                <span class={styles["keys-tooltip-name"]}>{apiKey.name}</span>
                                <span class={styles["keys-tooltip-separator"]}>for</span>
                                <ProviderModelBadge provider={apiKey.provider} showProviderLogo size="medium" />
                                <span class={styles["keys-tooltip-scope"]}>{SCOPE_LABELS[apiKey.scope] ?? apiKey.scope}</span>
                            </div>
                        )}
                    </For>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}

// ---------------------------------------------------------------------------

function SwitchAgentDropdown(props: {
    currentAgentId: string;
    onAgentChange: (agentId: string) => void;
    disabled?: boolean;
}): JSX.Element {
    const { data: agents } = useAgents(undefined as undefined);
    const [open, setOpen] = createSignal(false, { name: "switchAgentOpen" });

    return (
        <Popover open={open()} onOpenChange={setOpen}>
            <PopoverTrigger>
                <Button
                    variant="outline"
                    size="medium"
                    class={styles["switch-agent"]}
                    disabled={props.disabled}
                    data-label="Switch agent"
                >
                    <span>Switch agent</span>
                    <ChevronDown size={14} />
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <div class={styles["agent-list"]}>
                    <For each={agents() ?? []}>
                        {(agentItem) => {
                            const isCurrent = () => agentItem.id === props.currentAgentId;
                            return (
                                <div
                                    class={`${styles["agent-item"]} ${isCurrent() ? styles["agent-item-current"] : ""}`}
                                    onClick={() => {
                                        props.onAgentChange(agentItem.id);
                                        setOpen(false);
                                    }}
                                    data-label={`Agent: ${agentItem.name}`}
                                >
                                    <span>{agentItem.name}</span>
                                    <Show when={isCurrent()}>
                                        <Check size={14} />
                                    </Show>
                                </div>
                            );
                        }}
                    </For>
                </div>
            </PopoverContent>
        </Popover>
    );
}
