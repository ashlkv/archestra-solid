import type { ClientWebSocketMessage, ServerWebSocketMessage } from "@shared";

type WebSocketMessage = ClientWebSocketMessage | ServerWebSocketMessage;
type MessageHandler = (message: WebSocketMessage) => void;

function getWebSocketUrl(): string {
    if (typeof window === "undefined") return "";
    // Connect directly to backend - cookies are sent automatically for same-domain websockets
    if (import.meta.env.DEV) {
        return "ws://localhost:9000/ws";
    }
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    return `${protocol}//${host}/ws`;
}

class WebSocketService {
    private ws: WebSocket | null = null;
    private handlers: Map<WebSocketMessage["type"], Set<MessageHandler>> = new Map();
    private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = Infinity;
    private reconnectDelay = 1000;
    private maxReconnectDelay = 30000;
    private isManuallyDisconnected = false;
    private isConnecting = false;
    private pendingMessages: ClientWebSocketMessage[] = [];

    connect(): void {
        if (
            this.ws?.readyState === WebSocket.OPEN ||
            this.ws?.readyState === WebSocket.CONNECTING ||
            this.isConnecting
        ) {
            return;
        }

        this.isManuallyDisconnected = false;
        this.isConnecting = true;

        try {
            this.ws = new WebSocket(getWebSocketUrl());

            this.ws.addEventListener("open", () => {
                this.isConnecting = false;
                this.reconnectAttempts = 0;
                this.reconnectDelay = 1000;
                this.flushPendingMessages();
            });

            this.ws.addEventListener("message", (event) => {
                try {
                    const message: WebSocketMessage = JSON.parse(event.data);
                    this.handleMessage(message);
                } catch (error) {
                    console.error("[WebSocket] Failed to parse message:", error);
                }
            });

            this.ws.addEventListener("close", () => {
                this.ws = null;
                this.isConnecting = false;

                if (!this.isManuallyDisconnected) {
                    this.scheduleReconnect();
                }
            });
        } catch (error) {
            this.isConnecting = false;
            console.error("[WebSocket] Connection failed:", error);
            this.scheduleReconnect();
        }
    }

    private scheduleReconnect(): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error("[WebSocket] Max reconnect attempts reached");
            return;
        }

        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }

        this.reconnectAttempts++;
        const delay = Math.min(this.reconnectDelay * 1.3 ** this.reconnectAttempts, this.maxReconnectDelay);

        this.reconnectTimeout = setTimeout(() => {
            this.connect();
        }, delay);
    }

    disconnect(): void {
        this.isManuallyDisconnected = true;
        this.pendingMessages = [];

        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    subscribe<T extends WebSocketMessage["type"]>(
        type: T,
        handler: (message: Extract<WebSocketMessage, { type: T }>) => void,
    ): () => void {
        if (!this.handlers.has(type)) {
            this.handlers.set(type, new Set());
        }

        const wrappedHandler = handler as unknown as MessageHandler;
        this.handlers.get(type)?.add(wrappedHandler);

        return () => {
            const handlers = this.handlers.get(type);
            if (handlers) {
                handlers.delete(wrappedHandler);
                if (handlers.size === 0) {
                    this.handlers.delete(type);
                }
            }
        };
    }

    private handleMessage(message: WebSocketMessage): void {
        const handlers = this.handlers.get(message.type);
        if (handlers) {
            for (const handler of handlers) {
                try {
                    handler(message);
                } catch (error) {
                    console.error("[WebSocket] Error in message handler:", error);
                }
            }
        }
    }

    isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN;
    }

    private sendNow(message: ClientWebSocketMessage): void {
        if (!this.isConnected()) {
            this.pendingMessages.push(message);
            return;
        }

        try {
            this.ws?.send(JSON.stringify(message));
        } catch (error) {
            console.error("[WebSocket] Failed to send message:", error);
            this.pendingMessages.unshift(message);
        }
    }

    private flushPendingMessages(): void {
        if (!this.isConnected() || this.pendingMessages.length === 0) {
            return;
        }

        const queuedMessages = [...this.pendingMessages];
        this.pendingMessages = [];
        for (const message of queuedMessages) {
            this.sendNow(message);
        }
    }

    send(message: ClientWebSocketMessage): void {
        if (!this.isConnected()) {
            this.pendingMessages.push(message);
            if (!this.isManuallyDisconnected && !this.isConnecting && !this.ws) {
                this.connect();
            }
            return;
        }

        this.sendNow(message);
    }
}

const websocketService = new WebSocketService();

export default websocketService;
