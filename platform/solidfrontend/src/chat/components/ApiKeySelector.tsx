import { providerDisplayNames, type SupportedProvider } from "@shared";
import { createEffect, createSignal, For, type JSX, on, Show } from "solid-js";
import { ChevronDown, Key } from "@/icons";
import { Button } from "@/primitives/Button";
import { DropdownPanel, DropdownPanelEmpty, DropdownPanelItem } from "@/primitives/DropdownPanel";
import { Popover, PopoverContent, PopoverTrigger } from "@/primitives/Popover";
import { ProviderModelBadge } from "@/primitives/ProviderModelBadge";
import { useAvailableChatApiKeys } from "@/chat/chat-api-keys.query";
import type { ChatApiKey, ChatApiKeyScope } from "@/types";
import { getApiKeyListItems } from "./ApiKeySelector.utils";
import styles from "./ApiKeySelector.module.css";

const SCOPE_LABELS: Record<ChatApiKeyScope, string> = {
    personal: "me",
    team: "team",
    org_wide: "org",
};

export function ApiKeySelector(props: {
    selectedKeyId: string | undefined;
    onKeyChange: (keyId: string) => void;
    currentProvider?: SupportedProvider;
    disabled?: boolean;
    size?: "medium" | "small" | "xsmall";
    autoSelect?: boolean;
}): JSX.Element {
    const { data: availableKeys, query } = useAvailableChatApiKeys(undefined as undefined);
    const [open, setOpen] = createSignal(false, { name: "open" });

    const keys = () => availableKeys() ?? [];

    // Auto-select first key for the current provider when keys load
    createEffect(
        on(
            () => [keys(), props.currentProvider, props.selectedKeyId] as const,
            function autoSelectProviderKey([keyList, provider, currentKeyId]) {
                if (props.autoSelect === false) return;
                if (!keyList.length || currentKeyId) return;

                const providerKeys = provider ? keyList.filter((k) => k.provider === provider) : [];
                const personalKeys = providerKeys.filter((k) => k.scope === "personal");
                const teamKeys = providerKeys.filter((k) => k.scope === "team");
                const orgWideKeys = providerKeys.filter((k) => k.scope === "org_wide");

                const keyToSelect =
                    personalKeys[0] ||
                    teamKeys[0] ||
                    orgWideKeys[0] ||
                    keyList.filter((k) => k.scope === "personal")[0] ||
                    keyList.filter((k) => k.scope === "team")[0] ||
                    keyList.filter((k) => k.scope === "org_wide")[0];

                if (keyToSelect) {
                    props.onKeyChange(keyToSelect.id);
                }
            },
        ),
    );

    const keyItems = () =>
        getApiKeyListItems({
            keys: keys(),
            currentProvider: props.currentProvider,
        });

    const selectedKey = () => keys().find((k) => k.id === props.selectedKeyId);

    const onSelectKey = (keyId: string) => {
        if (keyId === props.selectedKeyId) {
            setOpen(false);
            return;
        }
        setOpen(false);
        props.onKeyChange(keyId);
    };

    return (
        <Show when={!query.pending && keys().length > 0}>
            <Popover open={open()} onOpenChange={setOpen}>
                <PopoverTrigger>
                    <Button
                        variant="muted"
                        size={props.size ?? "small"}
                        class={styles.trigger}
                        disabled={props.disabled}
                        data-label="API key selector trigger"
                    >
                        <Key size={12} />
                        <span class={styles["trigger-name"]}>{selectedKey()?.name ?? "Select key"}</span>
                        <ChevronDown size={14} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <DropdownPanel>
                        <Show when={keyItems().length === 0}>
                            <DropdownPanelEmpty>No API keys found.</DropdownPanelEmpty>
                        </Show>

                        <For each={keyItems()}>
                            {(item) => (
                                <KeyItem
                                    apiKey={item.key}
                                    isSelected={props.selectedKeyId === item.key.id}
                                    onSelect={() => onSelectKey(item.key.id)}
                                />
                            )}
                        </For>
                    </DropdownPanel>
                </PopoverContent>
            </Popover>
        </Show>
    );
}

// ---------------------------------------------------------------------------
// Internal
// ---------------------------------------------------------------------------

function KeyItem(props: {
    apiKey: ChatApiKey;
    isSelected: boolean;
    onSelect: () => void;
}): JSX.Element {
    return (
        <DropdownPanelItem
            onClick={props.onSelect}
            selected={props.isSelected}
            class={styles["key-item"]}
            data-label={`Key: ${props.apiKey.name}`}
        >
            <div class={styles["key-main"]}>
                <Key size={12} class={styles["key-icon"]} />
                <span class={styles["key-name"]}>{props.apiKey.name}</span>
                <span class={styles["key-separator"]}>for</span>
                <ProviderModelBadge
                    provider={props.apiKey.provider}
                    class={styles["provider-badge"]}
                    showProviderLogo={true}
                    size="medium"
                />
            </div>
            <span class={styles["scope-label"]} title={providerDisplayNames[props.apiKey.provider]}>
                {SCOPE_LABELS[props.apiKey.scope]}
            </span>
        </DropdownPanelItem>
    );
}

