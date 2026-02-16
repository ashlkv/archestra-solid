import { MCP_DEFAULT_LOG_LINES, type McpLogsErrorMessage, type McpLogsMessage } from "@shared";
import { createEffect, createSignal, type JSX, onCleanup, Show } from "solid-js";
import { ArrowDown, Terminal } from "@/components/icons";
import websocketService from "@/lib/websocket";
import { Button } from "../primitives/Button";
import { CopyButton } from "../primitives/CopyButton";
import { Dialog, DialogContent } from "../primitives/Dialog";
import { Select } from "../primitives/Select";
import { showError } from "../primitives/Toast";
import styles from "./McpLogsDialog.module.css";

type Installation = {
    id: string;
    name: string;
};

type Props = {
    serverName: string;
    installs: Installation[];
    hideInstallationSelector?: boolean;
    onClose: () => void;
};

function useStreamingAnimation(isActive: () => boolean): () => string {
    const [dotCount, setDotCount] = createSignal(0);

    createEffect(() => {
        if (!isActive()) {
            setDotCount(0);
            return;
        }

        const interval = setInterval(() => {
            setDotCount((prev) => (prev + 1) % 4);
        }, 400);

        onCleanup(() => clearInterval(interval));
    });

    return () => {
        const dots = ".".repeat(dotCount());
        const spaces = "\u00A0".repeat(3 - dotCount());
        return `Streaming${dots}${spaces}`;
    };
}

export function McpLogsDialog(props: Props): JSX.Element {
    const [streamedLogs, setStreamedLogs] = createSignal("");
    const [streamError, setStreamError] = createSignal<string | undefined>(undefined);
    const [command, setCommand] = createSignal("");
    const [autoScroll, setAutoScroll] = createSignal(true);
    const [isStreaming, setIsStreaming] = createSignal(false);
    const [serverId, setServerId] = createSignal<string | undefined>(undefined);

    // Set initial serverId when installs become available
    createEffect(() => {
        if (!serverId() && props.installs.length > 0) {
            setServerId(props.installs[0].id);
        }
    });

    let unsubscribeLogs: (() => void) | undefined;
    let unsubscribeError: (() => void) | undefined;
    let connectionTimeout: ReturnType<typeof setTimeout> | undefined;
    let hasReceivedMessage = false;
    let currentServerId: string | undefined;
    let scrollAreaRef: HTMLDivElement | undefined;

    const isWaitingForLogs = () => isStreaming() && !streamedLogs() && !streamError();
    const streamingText = useStreamingAnimation(isWaitingForLogs);

    const stopStreaming = () => {
        if (connectionTimeout) {
            clearTimeout(connectionTimeout);
            connectionTimeout = undefined;
        }

        if (unsubscribeLogs) {
            unsubscribeLogs();
            unsubscribeLogs = undefined;
        }
        if (unsubscribeError) {
            unsubscribeError();
            unsubscribeError = undefined;
        }

        if (currentServerId) {
            websocketService.send({
                type: "unsubscribe_mcp_logs",
                payload: { serverId: currentServerId },
            });
        }

        setIsStreaming(false);
        currentServerId = undefined;
    };

    const scrollToBottom = () => {
        if (scrollAreaRef) {
            scrollAreaRef.scrollTop = scrollAreaRef.scrollHeight;
            setAutoScroll(true);
        }
    };

    const startStreaming = (targetServerId: string) => {
        stopStreaming();

        setStreamError(undefined);
        setStreamedLogs("");
        setCommand("");
        setIsStreaming(true);
        hasReceivedMessage = false;
        currentServerId = targetServerId;

        websocketService.connect();

        connectionTimeout = setTimeout(() => {
            if (currentServerId === targetServerId) {
                const isStillWaiting = !websocketService.isConnected() || !hasReceivedMessage;
                if (!isStillWaiting) return;
                setStreamError("Connection timeout - unable to connect to server");
                setIsStreaming(false);
            }
        }, 10000);

        unsubscribeLogs = websocketService.subscribe("mcp_logs", (message: McpLogsMessage) => {
            if (message.payload.serverId !== targetServerId) return;

            hasReceivedMessage = true;

            if (connectionTimeout) {
                clearTimeout(connectionTimeout);
                connectionTimeout = undefined;
            }

            if (message.payload.command) {
                setCommand(message.payload.command);
            }

            setStreamedLogs((prev) => {
                const newLogs = prev + message.payload.logs;

                if (autoScroll()) {
                    setTimeout(() => {
                        if (scrollAreaRef) {
                            scrollAreaRef.scrollTop = scrollAreaRef.scrollHeight;
                        }
                    }, 10);
                }

                return newLogs;
            });
        });

        unsubscribeError = websocketService.subscribe("mcp_logs_error", (message: McpLogsErrorMessage) => {
            if (message.payload.serverId !== targetServerId) return;

            if (connectionTimeout) {
                clearTimeout(connectionTimeout);
                connectionTimeout = undefined;
            }

            setStreamError(message.payload.error);
            showError(`Streaming failed: ${message.payload.error}`);
            setIsStreaming(false);
        });

        websocketService.send({
            type: "subscribe_mcp_logs",
            payload: { serverId: targetServerId, lines: MCP_DEFAULT_LOG_LINES },
        });
    };

    createEffect(() => {
        const id = serverId();
        if (id) {
            startStreaming(id);
        }
    });

    onCleanup(() => {
        stopStreaming();
    });

    const handleScroll = () => {
        if (scrollAreaRef) {
            const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
            setAutoScroll(isAtBottom);
        }
    };

    return (
        <Dialog
            open
            onOpenChange={(open) => {
                if (!open) props.onClose();
            }}
        >
            <DialogContent title={`Logs: ${props.serverName}`} size="large">
                <div class={styles.container}>
                    <div class={styles.header}>
                        <div class={styles["header-icon"]}>
                            <Terminal size={20} />
                        </div>
                        <p class={styles.description}>View the recent logs from the MCP server deployment</p>
                    </div>

                    <Show when={!props.hideInstallationSelector && props.installs.length > 1}>
                        <div class={styles["install-selector"]}>
                            <span class={styles["install-label"]}>Installation:</span>
                            <Select
                                value={serverId() ?? ""}
                                onChange={setServerId}
                                options={props.installs.map((i) => ({ value: i.id, label: i.name }))}
                                placeholder="Select installation"
                                class={styles["install-trigger"]}
                            />
                        </div>
                    </Show>

                    <div class={styles["logs-section"]}>
                        <div class={styles["logs-header"]}>
                            <h3 class={styles["logs-title"]}>Deployment logs</h3>
                            <Show when={!autoScroll()}>
                                <Button variant="outline" size="small" onClick={scrollToBottom}>
                                    <ArrowDown size={12} />
                                    Scroll to bottom
                                </Button>
                            </Show>
                        </div>

                        <div class={styles["logs-container"]}>
                            <div ref={scrollAreaRef} class={styles["logs-scroll"]} onScroll={handleScroll}>
                                <div class={styles["logs-content"]}>
                                    <Show when={streamError()}>
                                        <div class={styles["logs-error"]}>Error loading logs: {streamError()}</div>
                                    </Show>
                                    <Show when={!streamError() && isWaitingForLogs()}>
                                        <div class={styles["logs-streaming"]}>{streamingText()}</div>
                                    </Show>
                                    <Show when={!streamError() && !isWaitingForLogs() && streamedLogs()}>
                                        <pre class={styles["logs-text"]}>{streamedLogs()}</pre>
                                    </Show>
                                    <Show when={!streamError() && !isWaitingForLogs() && !streamedLogs()}>
                                        <div class={styles["logs-empty"]}>No logs available</div>
                                    </Show>
                                </div>
                            </div>
                            <div class={styles["logs-footer"]}>
                                <Show when={isStreaming() && !streamError()}>
                                    <div class={styles["streaming-indicator"]}>
                                        <span class={styles["streaming-dot"]} />
                                        Streaming
                                    </div>
                                </Show>
                                <Show when={!isStreaming() || streamError()}>
                                    <div />
                                </Show>
                                <CopyButton
                                    text={streamedLogs()}
                                    label="Copy"
                                    class={styles["copy-button"]}
                                    disabled={!!streamError() || !streamedLogs()}
                                />
                            </div>
                        </div>
                    </div>

                    <Show when={command()}>
                        <div class={styles["command-section"]}>
                            <h3 class={styles["command-title"]}>Manual command</h3>
                            <div class={styles["command-container"]}>
                                <code class={styles["command-text"]}>{command()}</code>
                                <CopyButton text={command()} class={styles["command-copy"]} />
                            </div>
                        </div>
                    </Show>
                </div>
            </DialogContent>
        </Dialog>
    );
}
