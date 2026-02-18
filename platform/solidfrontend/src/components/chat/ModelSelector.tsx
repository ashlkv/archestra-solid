import { providerDisplayNames, type SupportedProvider } from "@shared";
import { createSignal, For, type JSX, Show } from "solid-js";
import {
    Check,
    Copy,
    DollarSign,
    FileText,
    ImageIcon,
    Layers,
    Loader2,
    Mic,
    RefreshCcw,
    Settings2,
    Video,
    X,
} from "@/components/icons";
import { Dialog, DialogContent, DialogTrigger } from "@/components/primitives/Dialog";
import { Tooltip } from "@/components/primitives/Tooltip";
import { groupModelsByProvider, useChatModels, useSyncChatModels } from "@/lib/chat-models.query";
import type { ChatModel, ModelCapabilities } from "@/types";
import styles from "./ModelSelector.module.css";

type FilterableModality = "image" | "audio" | "video" | "pdf";

const MODALITY_FILTERS: Array<{ modality: FilterableModality; icon: typeof ImageIcon; label: string }> = [
    { modality: "image", icon: ImageIcon, label: "Vision" },
    { modality: "audio", icon: Mic, label: "Audio" },
    { modality: "video", icon: Video, label: "Video" },
    { modality: "pdf", icon: FileText, label: "PDF" },
];

const PROVIDER_LOGO_MAP: Record<SupportedProvider, string> = {
    openai: "openai",
    anthropic: "anthropic",
    gemini: "google",
    bedrock: "amazon-bedrock",
    cerebras: "cerebras",
    cohere: "cohere",
    mistral: "mistral",
    vllm: "vllm",
    ollama: "ollama-cloud",
    zhipuai: "zhipuai",
};

export function ModelSelector(props: {
    selectedModel: string;
    onModelChange: (model: string) => void;
    disabled?: boolean;
}): JSX.Element {
    const { data: models, query } = useChatModels(undefined as undefined);
    const { submission: syncSubmission, submit: syncModels } = useSyncChatModels();
    const [open, setOpen] = createSignal(false, { name: "open" });
    const [searchQuery, setSearchQuery] = createSignal("", { name: "searchQuery" });
    const [modalityFilters, setModalityFilters] = createSignal<Set<FilterableModality>>(new Set<FilterableModality>(), { name: "modalityFilters" });
    const [toolCallingFilter, setToolCallingFilter] = createSignal(false, { name: "toolCallingFilter" });

    const onOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            setSearchQuery("");
            setModalityFilters(new Set<FilterableModality>());
            setToolCallingFilter(false);
        }
    };

    const modelsByProvider = () => groupModelsByProvider(models() ?? []);

    const availableProviders = () => Object.keys(modelsByProvider()) as SupportedProvider[];

    const availableModalities = () => {
        const modalities = new Set<FilterableModality>();
        for (const provider of availableProviders()) {
            for (const model of modelsByProvider()[provider] ?? []) {
                for (const modality of model.capabilities?.inputModalities ?? []) {
                    if (modality !== "text") modalities.add(modality as FilterableModality);
                }
            }
        }
        return modalities;
    };

    const hasActiveFilters = () => modalityFilters().size > 0 || toolCallingFilter();

    const matchesFilter = (model: ChatModel) => {
        if (!hasActiveFilters()) return true;
        if (hasUnknownCapabilities(model)) return true;
        for (const modality of modalityFilters()) {
            if (!model.capabilities?.inputModalities?.includes(modality)) return false;
        }
        if (toolCallingFilter() && !model.capabilities?.supportsToolCalling) return false;
        return true;
    };

    const matchesSearch = (model: ChatModel) => {
        const query = searchQuery().toLowerCase();
        if (!query) return true;
        return model.displayName.toLowerCase().includes(query) || model.id.toLowerCase().includes(query);
    };

    const filteredProviders = () => {
        const result: Array<{ provider: SupportedProvider; models: ChatModel[] }> = [];
        for (const provider of availableProviders()) {
            const filtered = (modelsByProvider()[provider] ?? []).filter(
                (model) => matchesFilter(model) && matchesSearch(model),
            );
            if (filtered.length > 0) {
                result.push({ provider, models: filtered });
            }
        }
        return result;
    };

    const selectedModelInfo = () => {
        for (const provider of availableProviders()) {
            const model = modelsByProvider()[provider]?.find((m) => m.id === props.selectedModel);
            if (model) return { model, provider };
        }
        return undefined;
    };

    const isModelAvailable = () => {
        return availableProviders().some((provider) =>
            modelsByProvider()[provider]?.some((m) => m.id === props.selectedModel),
        );
    };

    const onSelectModel = (modelId: string) => {
        if (modelId === props.selectedModel) {
            onOpenChange(false);
            return;
        }
        onOpenChange(false);
        props.onModelChange(modelId);
    };

    const toggleModality = (modality: FilterableModality) => {
        const current = new Set<FilterableModality>(modalityFilters());
        if (current.has(modality)) {
            current.delete(modality);
        } else {
            current.add(modality);
        }
        setModalityFilters(current);
    };

    const toggleToolCalling = () => {
        setToolCallingFilter(!toolCallingFilter());
    };

    // Loading state
    if (query.pending) {
        return (
            <button class={styles.trigger} disabled>
                <Loader2 size={14} class={styles.spinning} />
                <span class={styles["trigger-name"]}>Loading models...</span>
            </button>
        );
    }

    // No models
    if (availableProviders().length === 0) {
        return (
            <button class={styles.trigger} disabled>
                <span class={styles["trigger-name"]}>No models available</span>
            </button>
        );
    }

    const info = selectedModelInfo();
    const logoProvider = info ? PROVIDER_LOGO_MAP[info.provider] : undefined;

    return (
        <Dialog open={open()} onOpenChange={onOpenChange}>
            <DialogTrigger>
                <button class={styles.trigger} disabled={props.disabled} data-label="Model selector trigger">
                    <Show when={logoProvider}>
                        <ProviderLogo provider={logoProvider!} class={styles["trigger-logo"]} />
                    </Show>
                    <span class={styles["trigger-name"]}>
                        {info?.model.displayName || props.selectedModel || "Select model"}
                    </span>
                </button>
            </DialogTrigger>
            <DialogContent title="Select model" size="medium">
                <div class={styles["dialog-body"]}>
                    {/* Filters bar */}
                    <div class={styles["filters-bar"]}>
                        <Show when={availableModalities().size > 0}>
                            <span class={styles["filters-label"]}>Filter:</span>
                            <div class={styles["filters-group"]}>
                                <For each={MODALITY_FILTERS.filter((f) => availableModalities().has(f.modality))}>
                                    {(config) => (
                                        <FilterToggle
                                            icon={config.icon}
                                            label={config.label}
                                            active={modalityFilters().has(config.modality)}
                                            onClick={() => toggleModality(config.modality)}
                                        />
                                    )}
                                </For>
                                <FilterToggle
                                    icon={Settings2}
                                    label="Tools"
                                    active={toolCallingFilter()}
                                    onClick={toggleToolCalling}
                                />
                            </div>
                        </Show>
                        <Show when={availableModalities().size === 0}>
                            <div style={{ flex: "1" }} />
                        </Show>
                        <Tooltip content="Refresh models from providers">
                            <button
                                class={styles["refresh-button"]}
                                disabled={syncSubmission.pending}
                                onClick={() => syncModels(undefined as unknown as void)}
                                data-label="Refresh models"
                            >
                                <RefreshCcw size={16} class={syncSubmission.pending ? styles.spinning : ""} />
                            </button>
                        </Tooltip>
                    </div>

                    {/* Search */}
                    <div class={styles["search-input"]}>
                        <input
                            type="text"
                            placeholder="Search models..."
                            value={searchQuery()}
                            onInput={(event) => setSearchQuery(event.currentTarget.value)}
                            autofocus
                        />
                    </div>

                    {/* Model list */}
                    <div class={styles["model-list"]}>
                        {/* Current model if not in available list */}
                        <Show when={!isModelAvailable() && props.selectedModel}>
                            <div class={styles["provider-group"]}>
                                <div class={styles["provider-heading"]}>Current (API key missing)</div>
                                <div class={`${styles["model-item"]} ${styles.disabled}`}>
                                    <Show when={logoProvider}>
                                        <ProviderLogo provider={logoProvider!} class={styles["model-logo"]} />
                                    </Show>
                                    <span class={styles["model-name"]}>{props.selectedModel}</span>
                                    <div class={styles["model-details"]}>
                                        <Check size={16} />
                                    </div>
                                </div>
                            </div>
                        </Show>

                        <Show when={filteredProviders().length === 0}>
                            <div class={styles["empty-state"]}>
                                {hasActiveFilters() ? "No models match the selected filters." : "No models found."}
                            </div>
                        </Show>

                        <For each={filteredProviders()}>
                            {(group) => (
                                <div class={styles["provider-group"]}>
                                    <div class={styles["provider-heading"]}>{providerDisplayNames[group.provider]}</div>
                                    <For each={group.models}>
                                        {(model) => (
                                            <div
                                                class={styles["model-item"]}
                                                onClick={() => onSelectModel(model.id)}
                                                data-label={`Model: ${model.id}`}
                                            >
                                                <ProviderLogo
                                                    provider={PROVIDER_LOGO_MAP[group.provider]}
                                                    class={styles["model-logo"]}
                                                />
                                                <span class={styles["model-name"]}>
                                                    {model.displayName}{" "}
                                                    <span class={styles["model-id"]}>({model.id})</span>
                                                    <CopyModelIdButton modelId={model.id} />
                                                </span>
                                                <div class={styles["model-details"]}>
                                                    <CapabilityBadges capabilities={model.capabilities} />
                                                    <ContextLengthIndicator
                                                        contextLength={model.capabilities?.contextLength}
                                                    />
                                                    <PricingIndicator
                                                        pricePerMillionInput={model.capabilities?.pricePerMillionInput}
                                                        pricePerMillionOutput={
                                                            model.capabilities?.pricePerMillionOutput
                                                        }
                                                    />
                                                    <Show when={props.selectedModel === model.id}>
                                                        <Check size={16} />
                                                    </Show>
                                                    <Show when={props.selectedModel !== model.id}>
                                                        <div class={styles["check-placeholder"]} />
                                                    </Show>
                                                </div>
                                            </div>
                                        )}
                                    </For>
                                </div>
                            )}
                        </For>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ---------------------------------------------------------------------------
// Internal components
// ---------------------------------------------------------------------------

function ProviderLogo(props: { provider: string; class?: string }): JSX.Element {
    return (
        <img
            alt={`${props.provider} logo`}
            class={`${props.class ?? ""} ${styles["dark-invert"]}`}
            height={14}
            width={14}
            src={`https://models.dev/logos/${props.provider}.svg`}
        />
    );
}

function FilterToggle(props: {
    icon: typeof ImageIcon;
    label: string;
    active: boolean;
    onClick: () => void;
}): JSX.Element {
    return (
        <button class={`${styles["filter-toggle"]} ${props.active ? styles.active : ""}`} onClick={props.onClick}>
            <Show when={props.active}>
                <Check size={12} />
            </Show>
            <props.icon size={14} />
            <span>{props.label}</span>
        </button>
    );
}

function CopyModelIdButton(props: { modelId: string }): JSX.Element {
    const [copied, setCopied] = createSignal(false, { name: "copied" });

    const onClick = async (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        try {
            await navigator.clipboard.writeText(props.modelId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
            const textArea = document.createElement("textarea");
            textArea.value = props.modelId;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <button
            class={styles["copy-button"]}
            onClick={onClick}
            onMouseDown={(event) => event.stopPropagation()}
            aria-label={copied() ? "Copied!" : "Copy model ID"}
        >
            <Show when={copied()}>
                <Check size={10} style={{ color: "var(--success)" }} />
            </Show>
            <Show when={!copied()}>
                <Copy size={10} />
            </Show>
        </button>
    );
}

function CapabilityBadges(props: { capabilities?: ModelCapabilities }): JSX.Element {
    const hasVision = () => props.capabilities?.inputModalities?.includes("image");
    const hasAudio = () => props.capabilities?.inputModalities?.includes("audio");
    const hasVideo = () => props.capabilities?.inputModalities?.includes("video");
    const hasPdf = () => props.capabilities?.inputModalities?.includes("pdf");
    const hasToolCalling = () => props.capabilities?.supportsToolCalling;
    const hasAny = () => hasVision() || hasAudio() || hasVideo() || hasPdf() || hasToolCalling();

    if (!props.capabilities) {
        return <span class={styles["unknown-badge"]}>capabilities unknown</span>;
    }

    return (
        <>
            <Show when={!hasAny()}>
                <span class={styles["unknown-badge"]}>capabilities unknown</span>
            </Show>
            <Show when={hasAny()}>
                <div class={styles["capability-badges"]}>
                    <Show when={hasVision()}>
                        <Tooltip content="Supports vision (images)">
                            <span class={styles["capability-icon"]}>
                                <ImageIcon size={10} />
                            </span>
                        </Tooltip>
                    </Show>
                    <Show when={hasAudio()}>
                        <Tooltip content="Supports audio input">
                            <span class={styles["capability-icon"]}>
                                <Mic size={10} />
                            </span>
                        </Tooltip>
                    </Show>
                    <Show when={hasVideo()}>
                        <Tooltip content="Supports video input">
                            <span class={styles["capability-icon"]}>
                                <Video size={10} />
                            </span>
                        </Tooltip>
                    </Show>
                    <Show when={hasPdf()}>
                        <Tooltip content="Supports PDF input">
                            <span class={styles["capability-icon"]}>
                                <FileText size={10} />
                            </span>
                        </Tooltip>
                    </Show>
                    <Show when={hasToolCalling()}>
                        <Tooltip content="Supports tool calling">
                            <span class={styles["capability-icon"]}>
                                <Settings2 size={10} />
                            </span>
                        </Tooltip>
                    </Show>
                </div>
            </Show>
        </>
    );
}

function ContextLengthIndicator(props: { contextLength?: number | null }): JSX.Element {
    if (!props.contextLength) return <></>;

    return (
        <Tooltip content={`${props.contextLength.toLocaleString()} token context window`}>
            <span class={styles["context-length"]}>
                <Layers size={12} />
                {formatContextLength(props.contextLength)}
            </span>
        </Tooltip>
    );
}

function PricingIndicator(props: {
    pricePerMillionInput?: string | null;
    pricePerMillionOutput?: string | null;
}): JSX.Element {
    if (!props.pricePerMillionInput && !props.pricePerMillionOutput) return <></>;

    const tooltipText = () => {
        const parts: string[] = [];
        if (props.pricePerMillionInput) parts.push(`Input: $${props.pricePerMillionInput}/M tokens`);
        if (props.pricePerMillionOutput) parts.push(`Output: $${props.pricePerMillionOutput}/M tokens`);
        return parts.join(", ");
    };

    return (
        <Tooltip content={tooltipText()}>
            <span class={styles["pricing-icon"]}>
                <DollarSign size={12} />
            </span>
        </Tooltip>
    );
}

function hasUnknownCapabilities(model: ChatModel): boolean {
    const capabilities = model.capabilities;
    if (!capabilities) return true;
    return (
        !capabilities.inputModalities?.includes("image") &&
        !capabilities.inputModalities?.includes("audio") &&
        !capabilities.inputModalities?.includes("video") &&
        !capabilities.inputModalities?.includes("pdf") &&
        !capabilities.supportsToolCalling
    );
}

function formatContextLength(contextLength: number): string {
    if (contextLength >= 1_000_000) {
        return `${(contextLength / 1_000_000).toFixed(contextLength % 1_000_000 === 0 ? 0 : 1)}M`;
    }
    if (contextLength >= 1_000) {
        return `${(contextLength / 1_000).toFixed(contextLength % 1_000 === 0 ? 0 : 1)}K`;
    }
    return contextLength.toString();
}
