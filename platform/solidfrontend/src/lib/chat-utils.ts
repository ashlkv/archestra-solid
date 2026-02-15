import type { UIMessage } from "ai";

/**
 * Returns a display title for a conversation.
 * Priority: explicit title > first user message text > fallback.
 */
export function getConversationDisplayTitle(title: string | null | undefined, messages?: UIMessage[]): string {
    if (title) return title;

    if (messages) {
        const firstUserMessage = messages.find((message) => message.role === "user");
        if (firstUserMessage) {
            const textPart = firstUserMessage.parts.find((part) => part.type === "text");
            if (textPart && "text" in textPart) return textPart.text;
        }
    }

    return "New chat session";
}
