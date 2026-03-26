import { describe, expect, it } from "vitest";
import type { ChatApiKey } from "@/types";
import { getApiKeyListItems } from "./ApiKeySelector.utils";

describe("ApiKeySelector utilities", () => {
    it("prioritizes the current provider and flattens keys into a single list", () => {
        const keys = [
            makeChatApiKey({ id: "openai-1", name: "My OpenAI key", provider: "openai", scope: "personal" }),
            makeChatApiKey({ id: "gemini-1", name: "My Gemini key", provider: "gemini", scope: "org_wide" }),
            makeChatApiKey({ id: "openai-2", name: "Team OpenAI key", provider: "openai", scope: "team" }),
        ];

        expect(
            getApiKeyListItems({
                keys,
                currentProvider: "gemini",
            }).map((item) => item.key.id),
        ).toEqual(["gemini-1", "openai-1", "openai-2"]);
    });
});

function makeChatApiKey(overrides: Partial<ChatApiKey>): ChatApiKey {
    return {
        id: "key-1",
        name: "Key",
        provider: "openai",
        scope: "personal",
        teamId: null,
        teamName: null,
        ...overrides,
    } as ChatApiKey;
}
