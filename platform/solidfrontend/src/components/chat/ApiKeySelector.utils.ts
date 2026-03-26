import type { SupportedProvider } from "@shared";
import type { ChatApiKey } from "@/types";

export type ApiKeyListItem = {
    provider: SupportedProvider;
    key: ChatApiKey;
};

export function getApiKeyListItems(params: {
    keys: ChatApiKey[];
    currentProvider?: SupportedProvider;
}): ApiKeyListItem[] {
    const keysByProvider = new Map<SupportedProvider, ChatApiKey[]>();

    for (const key of params.keys) {
        const providerKeys = keysByProvider.get(key.provider) ?? [];
        providerKeys.push(key);
        keysByProvider.set(key.provider, providerKeys);
    }

    return sortProviders({
        providers: Array.from(keysByProvider.keys()),
        currentProvider: params.currentProvider,
    }).flatMap((provider) => (keysByProvider.get(provider) ?? []).map((key) => ({ provider, key })));
}

function sortProviders(params: {
    providers: SupportedProvider[];
    currentProvider?: SupportedProvider;
}): SupportedProvider[] {
    return [...params.providers].sort((a, b) => {
        if (params.currentProvider) {
            if (a === params.currentProvider) return -1;
            if (b === params.currentProvider) return 1;
        }

        return a.localeCompare(b);
    });
}
