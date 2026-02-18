/**
 * SolidJS chat primitive built on the framework-agnostic `ai` package.
 *
 * Implements the `ChatState` interface using SolidJS signals instead of
 * React's `useSyncExternalStore`. All streaming, transport, and protocol
 * logic lives in `AbstractChat` from the `ai` package — this file only
 * provides the reactive glue.
 */

import {
    AbstractChat,
    type ChatInit,
    type ChatOnDataCallback,
    type ChatOnErrorCallback,
    type ChatOnFinishCallback,
    type ChatOnToolCallCallback,
    type ChatState,
    type ChatStatus,
    DefaultChatTransport,
    generateId,
    type UIMessage,
} from "ai";
import { createSignal, onCleanup } from "solid-js";

// ---------------------------------------------------------------------------
// SolidJS ChatState implementation
// ---------------------------------------------------------------------------

class SolidChatState<UI_MESSAGE extends UIMessage> implements ChatState<UI_MESSAGE> {
    #messages: UI_MESSAGE[];
    #status: ChatStatus = "ready";
    #error: Error | undefined = undefined;

    // SolidJS signal setters — called on every state change so reactive
    // consumers (components reading `chat.messages()`) re-render.
    #setMessages: (messages: UI_MESSAGE[]) => void;
    #setStatus: (status: ChatStatus) => void;
    #setError: (error: Error | undefined) => void;

    constructor(
        initialMessages: UI_MESSAGE[],
        setMessages: (messages: UI_MESSAGE[]) => void,
        setStatus: (status: ChatStatus) => void,
        setError: (error: Error | undefined) => void,
    ) {
        this.#messages = initialMessages;
        this.#setMessages = setMessages;
        this.#setStatus = setStatus;
        this.#setError = setError;
    }

    get status(): ChatStatus {
        return this.#status;
    }

    set status(value: ChatStatus) {
        this.#status = value;
        this.#setStatus(value);
    }

    get error(): Error | undefined {
        return this.#error;
    }

    set error(value: Error | undefined) {
        this.#error = value;
        this.#setError(value);
    }

    get messages(): UI_MESSAGE[] {
        return this.#messages;
    }

    set messages(value: UI_MESSAGE[]) {
        this.#messages = [...value];
        this.#setMessages(this.#messages);
    }

    pushMessage = (message: UI_MESSAGE) => {
        this.#messages = this.#messages.concat(message);
        this.#setMessages(this.#messages);
    };

    popMessage = () => {
        this.#messages = this.#messages.slice(0, -1);
        this.#setMessages(this.#messages);
    };

    replaceMessage = (index: number, message: UI_MESSAGE) => {
        this.#messages = [
            ...this.#messages.slice(0, index),
            this.snapshot(message),
            ...this.#messages.slice(index + 1),
        ];
        this.#setMessages(this.#messages);
    };

    snapshot = <T>(value: T): T => structuredClone(value);
}

// ---------------------------------------------------------------------------
// SolidJS Chat class (extends AbstractChat)
// ---------------------------------------------------------------------------

class SolidChat<UI_MESSAGE extends UIMessage> extends AbstractChat<UI_MESSAGE> {
    constructor(
        init: ChatInit<UI_MESSAGE> & {
            setMessages: (messages: UI_MESSAGE[]) => void;
            setStatus: (status: ChatStatus) => void;
            setError: (error: Error | undefined) => void;
        },
    ) {
        const { setMessages, setStatus, setError, messages, ...rest } = init;
        const state = new SolidChatState(messages ?? [], setMessages, setStatus, setError);
        super({ ...rest, state });
    }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface ChatSession {
    /** Reactive accessor for messages */
    messages: () => UIMessage[];
    /** Reactive accessor for streaming status */
    status: () => ChatStatus;
    /** Reactive accessor for error */
    error: () => Error | undefined;
    /** Send a new message */
    sendMessage: (message: string | { text: string }) => Promise<void>;
    /** Stop the current stream */
    stop: () => Promise<void>;
    /** Replace messages (e.g. to sync from backend) */
    setMessages: (messages: UIMessage[]) => void;
    /** Add a tool result for a pending tool call */
    addToolResult: AbstractChat<UIMessage>["addToolResult"];
}

export interface CreateChatOptions {
    /** Conversation ID — used as chat ID in the transport */
    conversationId: string;
    /** API endpoint (defaults to "/api/chat") */
    api?: string;
    /** Initial messages to populate (e.g. from backend) */
    initialMessages?: UIMessage[];
    /** Called when streaming finishes */
    onFinish?: ChatOnFinishCallback<UIMessage>;
    /** Called on error */
    onError?: ChatOnErrorCallback;
    /** Called on tool call */
    onToolCall?: ChatOnToolCallCallback<UIMessage>;
    /** Called on data parts (e.g. token usage) */
    onData?: ChatOnDataCallback<UIMessage>;
}

/**
 * Create a reactive chat session for a given conversation.
 *
 * Call this inside a SolidJS component or reactive context.
 * Returns signal-based accessors for messages/status/error and
 * imperative methods for sending messages and stopping streams.
 */
export function createChat(options: CreateChatOptions): ChatSession {
    const [messages, setMessages] = createSignal<UIMessage[]>(options.initialMessages ?? [], { name: "messages" });
    const [status, setStatus] = createSignal<ChatStatus>("ready", { name: "status" });
    const [error, setError] = createSignal<Error | undefined>(undefined, { name: "error" });

    const chat = new SolidChat({
        id: options.conversationId,
        messages: options.initialMessages,
        generateId,
        transport: new DefaultChatTransport({
            api: options.api ?? "/api/chat",
            credentials: "include",
        }),
        onFinish: options.onFinish,
        onError: (chatError) => {
            console.error("[createChat] Error:", chatError);
            options.onError?.(chatError);
        },
        onToolCall: options.onToolCall,
        onData: options.onData,
        setMessages,
        setStatus,
        setError,
    });

    onCleanup(() => {
        chat.stop();
    });

    return {
        messages,
        status,
        error,
        sendMessage: async (message: string | { text: string }) => {
            if (typeof message === "string") {
                await chat.sendMessage({ text: message });
            } else {
                await chat.sendMessage(message);
            }
        },
        stop: () => chat.stop(),
        setMessages: (newMessages: UIMessage[]) => {
            chat.messages = newMessages;
        },
        addToolResult: chat.addToolResult.bind(chat),
    };
}
