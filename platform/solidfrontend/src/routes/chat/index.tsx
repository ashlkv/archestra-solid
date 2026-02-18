import { archestraApiSdk, type SupportedProvider } from "@shared";
import { useSearchParams } from "@solidjs/router";
import type { UIMessage } from "ai";
import { createEffect, createSignal, type JSX, on, Show } from "solid-js";
import { AgentSelector } from "@/components/chat/AgentSelector";
import { ApiKeySelector } from "@/components/chat/ApiKeySelector";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatToolsDisplay } from "@/components/chat/ChatToolsDisplay";
import { ModelSelector } from "@/components/chat/ModelSelector";
import { PromptInput } from "@/components/chat/PromptInput";
import { showError } from "@/components/primitives/Toast";
import { useAgents } from "@/lib/agent.query";
import { getAuthHeaders } from "@/lib/api";
import { type ChatSession, createChat } from "@/lib/chat/create-chat";
import { useConversation } from "@/lib/chat.query";
import { useChatModels } from "@/lib/chat-models.query";

export default function ChatPage(): JSX.Element {
    const [searchParams, setSearchParams] = useSearchParams();

    const conversationId = () => searchParams.conversation as string | undefined;
    const [agentId, setAgentId] = createSignal<string | undefined>(undefined, { name: "agentId" });
    const [selectedModel, setSelectedModel] = createSignal<string>("", { name: "selectedModel" });
    const [selectedApiKeyId, setSelectedApiKeyId] = createSignal<string | undefined>(undefined, { name: "selectedApiKeyId" });
    const [chatSession, setChatSession] = createSignal<ChatSession | undefined>(undefined, { name: "chatSession" });
    const [pendingPrompt, setPendingPrompt] = createSignal<string | undefined>(undefined, { name: "pendingPrompt" });
    const [creating, setCreating] = createSignal(false, { name: "creating" });

    const { data: agents } = useAgents(undefined as undefined);
    const { data: chatModels } = useChatModels(undefined as undefined);

    // Auto-select first agent when agents load and none is selected
    createEffect(
        on(
            () => agents(),
            (agentList) => {
                if (agentId() || !agentList?.length) return;
                setAgentId(agentList[0].id);
            },
        ),
    );

    // Auto-select first model when models load and none is selected
    createEffect(
        on(
            () => chatModels(),
            (modelList) => {
                if (selectedModel() || !modelList?.length) return;
                setSelectedModel(modelList[0].id);
            },
        ),
    );

    const agentName = () => {
        const id = agentId();
        if (!id) return undefined;
        return agents()?.find((agent) => agent.id === id)?.name;
    };

    const selectedModelProvider = (): SupportedProvider | undefined => {
        const model = selectedModel();
        if (!model) return undefined;
        return chatModels()?.find((m) => m.id === model)?.provider;
    };

    // ----- Active conversation: load and set up chat session -----

    const conversation = useConversation(() => conversationId() ?? "");

    createEffect(
        on(
            () => conversation.data(),
            (conversationData) => {
                const currentConversationId = conversationId();
                if (!conversationData || !currentConversationId) return;

                setAgentId(conversationData.agentId);
                if (conversationData.selectedModel) {
                    setSelectedModel(conversationData.selectedModel);
                }
                if (conversationData.chatApiKeyId) {
                    setSelectedApiKeyId(conversationData.chatApiKeyId);
                }

                const session = createChat({
                    conversationId: currentConversationId,
                    initialMessages: (conversationData.messages as UIMessage[]) ?? [],
                    onError: (error) => {
                        console.error("[ChatPage] Stream error:", error);
                    },
                });

                setChatSession(session);

                // Send pending prompt from conversation creation
                const prompt = pendingPrompt();
                if (prompt) {
                    setPendingPrompt(undefined);
                    session.sendMessage(prompt);
                }
            },
        ),
    );

    // ----- Initial mode: create conversation then navigate -----

    const onInitialSubmit = async (text: string) => {
        const selectedAgentId = agentId();
        if (!selectedAgentId) return;

        setPendingPrompt(text);
        setCreating(true);

        try {
            const response = await archestraApiSdk.createChatConversation({
                headers: getAuthHeaders(),
                body: {
                    agentId: selectedAgentId,
                    selectedModel: selectedModel() || undefined,
                    selectedProvider: selectedModelProvider(),
                    chatApiKeyId: selectedApiKeyId() || undefined,
                },
            });

            if (response.data) {
                setSearchParams({ conversation: response.data.id });
            } else {
                const errorObj = response.error as { error?: { message?: string }; message?: string } | undefined;
                const errorMessage = errorObj?.error?.message ?? errorObj?.message ?? "Failed to create conversation";
                showError(typeof errorMessage === "string" ? errorMessage : "Failed to create conversation");
                setPendingPrompt(undefined);
            }
        } catch (exception) {
            console.error("[ChatPage] Failed to create conversation:", exception);
            showError("Failed to create conversation");
            setPendingPrompt(undefined);
        } finally {
            setCreating(false);
        }
    };

    const onActiveSubmit = (text: string) => {
        chatSession()?.sendMessage(text);
    };

    const onStop = () => {
        chatSession()?.stop();
    };

    return (
        <div
            style={{
                display: "flex",
                "flex-direction": "column",
                height: "100%",
                overflow: "hidden",
            }}
            data-label="Chat page"
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    "align-items": "center",
                    gap: "0.75rem",
                    padding: "0.75rem 1rem",
                    "border-bottom": "1px solid var(--border)",
                    "flex-shrink": "0",
                }}
                data-label="Chat header"
            >
                <AgentSelector agentId={agentId()} onAgentChange={setAgentId} disabled={!!conversationId()} />
                <Show when={agentName()}>
                    <span style={{ "font-weight": "500" }}>{agentName()}</span>
                </Show>
            </div>

            {/* Messages */}
            <ChatMessages
                messages={() => chatSession()?.messages() ?? []}
                status={() => chatSession()?.status() ?? "ready"}
                error={() => chatSession()?.error()}
                agentName={agentName()}
            />

            {/* Prompt Input */}
            <Show when={conversationId() && chatSession()}>
                <PromptInput
                    onSubmit={onActiveSubmit}
                    onStop={onStop}
                    status={chatSession()?.status() ?? "ready"}
                    placeholder={`Message ${agentName() ?? "assistant"}...`}
                    headerContent={
                        <Show when={agentId()}>
                            <ChatToolsDisplay agentId={agentId()!} conversationId={conversationId()} />
                        </Show>
                    }
                    footerLeft={
                        <>
                            <ModelSelector
                                selectedModel={selectedModel()}
                                onModelChange={setSelectedModel}
                                disabled={!!conversationId()}
                            />
                            <ApiKeySelector
                                selectedKeyId={selectedApiKeyId()}
                                onKeyChange={setSelectedApiKeyId}
                                currentProvider={selectedModelProvider()}
                            />
                        </>
                    }
                />
            </Show>
            <Show when={!conversationId()}>
                <PromptInput
                    onSubmit={onInitialSubmit}
                    status={creating() ? "submitted" : "ready"}
                    disabled={!agentId()}
                    placeholder={
                        agentId() ? `Message ${agentName() ?? "assistant"}...` : "Select an agent to start chatting"
                    }
                    headerContent={
                        <Show when={agentId()}>
                            <ChatToolsDisplay agentId={agentId()!} />
                        </Show>
                    }
                    footerLeft={
                        <>
                            <ModelSelector selectedModel={selectedModel()} onModelChange={setSelectedModel} />
                            <ApiKeySelector
                                selectedKeyId={selectedApiKeyId()}
                                onKeyChange={setSelectedApiKeyId}
                                currentProvider={selectedModelProvider()}
                            />
                        </>
                    }
                />
            </Show>
        </div>
    );
}
