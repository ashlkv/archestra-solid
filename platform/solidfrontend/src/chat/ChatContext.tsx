import { createContext, type ParentProps, useContext } from 'solid-js';
import { ChatSession, createChat, CreateChatOptions } from '~/chat/create-chat';

type ChatContextType = {
    getChat: (newChat: CreateChatOptions) => ChatSession;
    scheduleCleanup: (chatId: string) => void;
    cancelCleanup: (chatId: string) => void;
    usageCounts: ReadonlyMap<string, number>;
    chats: ReadonlyMap<string, ChatSession>;
    timers: ReadonlyMap<string, number>;
}

const ChatContext = createContext<ChatContextType>({
    getChat: (newChat: CreateChatOptions) => createChat(newChat),
    scheduleCleanup: (_chatId: string) => {},
    cancelCleanup: (_chatId: string) => {},
    usageCounts: new Map(),
    chats: new Map(),
    timers: new Map(),
});
export const useChatContext = () => useContext(ChatContext);

export const ChatContextProvider = (props: ParentProps) => {
    const chats = new Map<string, ChatSession>();
    const usageCounts = new Map<string, number>();
    const timers = new Map<string, number>();

    function getChat({ id, ...rest }: CreateChatOptions): ChatSession {
        if (!chats.has(id)) {
            chats.set(id, createChat({id, ...rest}))
        }
        return chats.get(id)!;
    }
    function scheduleCleanup(chatId: string) {
        const count = usageCounts.get(chatId) ?? 0;
        if (count === 1) {
            usageCounts.set(chatId, count - 1)
            const existingTimer = timers.get(chatId);
            if (existingTimer) {
                clearTimeout(existingTimer);
            }
            const timer = setTimeout(function () {
                const chat = chats.get(chatId);
                if (chat) {
                    chat.stop();
                }
                chats.delete(chatId)
                usageCounts.delete(chatId);
                timers.delete(chatId);
            }, 60 * 10 * 1000)
            timers.set(chatId, timer);
        }
        // Otherwise too early or too late to schedule a cleanup: the chat is still in use by some other components
    }

    function cancelCleanup(chatId: string) {
        const count = usageCounts.get(chatId) ?? 0;
        usageCounts.set(chatId, count + 1);

        const timer = timers.get(chatId)
        if (timer) {
            clearTimeout(timer);
            timers.delete(chatId);
        }

    }

    return <ChatContext.Provider
        value={{getChat, scheduleCleanup, cancelCleanup, usageCounts, chats, timers}}>{props.children}</ChatContext.Provider>
}
