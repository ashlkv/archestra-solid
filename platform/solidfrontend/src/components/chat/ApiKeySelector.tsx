import { providerDisplayNames, type SupportedProvider } from "@shared";
import { createEffect, createSignal, For, type JSX, on, Show } from "solid-js";
import { Building2, Check, Key, User, Users } from "@/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/primitives/Popover";
import { useAvailableChatApiKeys } from "@/lib/chat-api-keys.query";
import type { ChatApiKey, ChatApiKeyScope } from "@/types";
import styles from "./ApiKeySelector.module.css";

const SCOPE_ICONS: Record<ChatApiKeyScope, (size: number) => JSX.Element> = {
    personal: (size) => <User size={size} />,
    team: (size) => <Users size={size} />,
    org_wide: (size) => <Building2 size={size} />,
};

export function ApiKeySelector(props: {
    selectedKeyId: string | undefined;
    onKeyChange: (keyId: string) => void;
    currentProvider?: SupportedProvider;
    disabled?: boolean;
}): JSX.Element {
    const { data: availableKeys, query } = useAvailableChatApiKeys(undefined as undefined);
    const [open, setOpen] = createSignal(false, { name: "open" });
    const [searchQuery, setSearchQuery] = createSignal("", { name: "searchQuery" });

    const keys = () => availableKeys() ?? [];

    // Auto-select first key for the current provider when keys load
    createEffect(
        on(
            () => [keys(), props.currentProvider, props.selectedKeyId] as const,
            ([keyList, provider, currentKeyId]) => {
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

    const keysByProvider = () => {
        const grouped: Partial<Record<SupportedProvider, ChatApiKey[]>> = {};
        for (const key of keys()) {
            if (!grouped[key.provider]) {
                grouped[key.provider] = [];
            }
            grouped[key.provider]!.push(key);
        }
        return grouped;
    };

    const sortedProviders = () => {
        const providerList = Object.keys(keysByProvider()) as SupportedProvider[];
        const current = props.currentProvider;
        if (!current) return providerList;
        return providerList.sort((a, b) => {
            if (a === current) return -1;
            if (b === current) return 1;
            return a.localeCompare(b);
        });
    };

    const providerGroups = () => {
        const search = searchQuery().toLowerCase();
        const result: Array<{ provider: SupportedProvider; keys: ChatApiKey[] }> = [];
        for (const provider of sortedProviders()) {
            const providerKeys = keysByProvider()[provider] ?? [];
            const filtered = search
                ? providerKeys.filter(
                      (key) =>
                          key.name.toLowerCase().includes(search) ||
                          (key.teamName ?? "").toLowerCase().includes(search),
                  )
                : providerKeys;
            if (filtered.length > 0) {
                result.push({ provider, keys: filtered });
            }
        }
        return result;
    };

    const selectedKey = () => keys().find((k) => k.id === props.selectedKeyId);

    const onSelectKey = (keyId: string) => {
        if (keyId === props.selectedKeyId) {
            setOpen(false);
            return;
        }
        setOpen(false);
        setSearchQuery("");
        props.onKeyChange(keyId);
    };

    // Don't render if loading or no keys
    if (query.pending) return <></>;
    if (!query.pending && keys().length === 0) return <></>;

    return (
        <Popover open={open()} onOpenChange={setOpen}>
            <PopoverTrigger>
                <button class={styles.trigger} disabled={props.disabled} data-label="API key selector trigger">
                    <Key size={14} />
                    <span class={styles["trigger-name"]}>
                        {selectedKey() ? getKeyDisplayName(selectedKey()!) : "Select key"}
                    </span>
                </button>
            </PopoverTrigger>
            <PopoverContent>
                <div class={styles["popover-body"]}>
                    <div class={styles["search-input"]}>
                        <input
                            type="text"
                            placeholder="Search API keys..."
                            value={searchQuery()}
                            onInput={(event) => setSearchQuery(event.currentTarget.value)}
                            autofocus
                        />
                    </div>

                    <Show when={providerGroups().length === 0}>
                        <div class={styles["empty-state"]}>No API keys found.</div>
                    </Show>

                    <For each={providerGroups()}>
                        {(group) => (
                            <div class={styles["provider-group"]}>
                                <div class={styles["provider-heading"]}>{providerDisplayNames[group.provider]}</div>
                                <For each={group.keys}>
                                    {(key) => (
                                        <KeyItem
                                            apiKey={key}
                                            isSelected={props.selectedKeyId === key.id}
                                            onSelect={() => onSelectKey(key.id)}
                                        />
                                    )}
                                </For>
                            </div>
                        )}
                    </For>
                </div>
            </PopoverContent>
        </Popover>
    );
}

// ---------------------------------------------------------------------------
// Internal
// ---------------------------------------------------------------------------

function KeyItem(props: { apiKey: ChatApiKey; isSelected: boolean; onSelect: () => void }): JSX.Element {
    return (
        <div class={styles["key-item"]} onClick={props.onSelect} data-label={`Key: ${props.apiKey.name}`}>
            <div class={styles["key-info"]}>
                {SCOPE_ICONS[props.apiKey.scope](12)}
                <span class={styles["key-name"]}>{props.apiKey.name}</span>
                <Show when={props.apiKey.scope === "team" && props.apiKey.teamName}>
                    <span class={styles["team-badge"]}>{props.apiKey.teamName}</span>
                </Show>
            </div>
            <Show when={props.isSelected}>
                <Check size={16} />
            </Show>
        </div>
    );
}

function getKeyDisplayName(key: ChatApiKey): string {
    if (key.scope === "team" && key.teamName) {
        return `${key.name} (${key.teamName})`;
    }
    return key.name;
}
