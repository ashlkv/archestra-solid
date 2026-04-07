import { archestraApiSdk, type SupportedProvider } from "@shared";
import { useSearchParams } from "@solidjs/router";
import type { UIMessage } from "ai";
import { createEffect, createSignal, type JSX, on, Show } from "solid-js";
import { AgentSelector } from "@/chat/components/AgentSelector";
import { AgentSettings } from "@/chat/components/AgentSettings";
import { LlmSelectorGroup } from "@/chat/components/LlmSelectorGroup";
import { ChatMessages } from "@/chat/components/ChatMessages";
import { ChatToolsDisplay } from "@/chat/components/ChatToolsDisplay";
import { PromptInput } from "@/chat/components/PromptInput";
import { showError } from "@/primitives/Toast";
import { useAgents } from "@/lib/agent.query";
import { getAuthHeaders } from "@/api";
import { type ChatSession, createChat } from "@/chat/create-chat";
import { useConversation } from "@/chat/chat.query";
import { useChatModels } from "@/chat/chat-models.query";
import { HorizontalSplit } from '~/primitives/HorizontalSplit';
import { VerticalSplit } from '~/primitives/VerticalSplit';
import { Scrollable } from '~/primitives/Scrollable';
import { Column } from '~/primitives/Column';
import { ChatSplit } from '~/chat/components/ChatSplit';
import { ConversationSplit } from '~/chat/components/ConversationSplit';
import { ChatHistory } from '~/chat/components/ChatHistory';
import { Panel } from '~/primitives/Panel';

export default function ChatPage(): JSX.Element {
    const [searchParams, setSearchParams] = useSearchParams();

    const conversationId = () => searchParams.conversation as string | undefined;
    const activeConversationId = () => conversationId() ?? conversation.data()?.id;
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
            function autoSelectFirstAgent(agentList) {
                if (agentId() || !agentList?.length) return;
                setAgentId(agentList[0].id);
            },
        ),
    );

    // Auto-select first model when models load and none is selected
    createEffect(
        on(
            () => chatModels(),
            function autoSelectFirstModel(modelList) {
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

    const conversation = useConversation(() => conversationId() ?? "");

    // When a conversation loads, apply its saved agent/model/key to page selectors
    // and create a chat session with the conversation's message history.
    createEffect(
        on(
            () => conversation.data(),
            function initializeFromConversation(conversationData) {
                const currentConversationId = conversationId();
                if (!conversationData || !currentConversationId) return;

                setAgentId(conversationData.agentId ?? undefined);
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

    const onStart = async (text: string) => {
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

    const onContinue = (text: string) => {
        chatSession()?.sendMessage(text);
    };

    const onStop = () => {
        chatSession()?.stop();
    };

    const promptInputConfig = () => {
        const currentConversationId = conversationId();
        const hasActiveConversation = !!(currentConversationId && chatSession());

        return {
            visible: hasActiveConversation || !currentConversationId,
            onSubmit: hasActiveConversation ? onContinue : onStart,
            onStop: hasActiveConversation ? onStop : undefined,
            status: hasActiveConversation ? chatSession()?.status() ?? "ready" : creating() ? "submitted" : "ready",
            disabled: hasActiveConversation ? false : !agentId(),
            placeholder: hasActiveConversation
                ? `Message ${agentName() ?? "assistant"}...`
                : agentId()
                  ? `Message ${agentName() ?? "assistant"}...`
                  : "Select an agent to start chatting",
            headerContent: agentId() ? (
                <ChatToolsDisplay agentId={agentId()!} conversationId={hasActiveConversation ? currentConversationId : undefined} />
            ) : undefined,
        };
    };

    return (<ChatSplit>
        <Scrollable>
            <ConversationSplit>
                <Scrollable>
                    <ChatMessages
                        messages={() => chatSession()?.messages() ?? []}
                        status={() => chatSession()?.status() ?? "ready"}
                        error={() => chatSession()?.error()}
                        agentName={agentName()}
                    />
                </Scrollable>
                <Column>
                    <Show when={promptInputConfig().visible}>
                        <PromptInput
                            onSubmit={promptInputConfig().onSubmit}
                            onStop={promptInputConfig().onStop}
                            status={promptInputConfig().status}
                            disabled={promptInputConfig().disabled}
                            placeholder={promptInputConfig().placeholder}
                            footerLeft={
                                <LlmSelectorGroup
                                    selectedKeyId={selectedApiKeyId()}
                                    onKeyChange={setSelectedApiKeyId}
                                    currentProvider={selectedModelProvider()}
                                    selectedModel={selectedModel()}
                                    onModelChange={setSelectedModel}
                                    disabled={!activeConversationId()}
                                    size="small"
                                />
                            }
                        />
                    </Show>
                </Column>
            </ConversationSplit>
        </Scrollable>
        <Scrollable>
            <Show when={agentId()}>
                <Panel fullHeight>
                    <AgentSettings agentId={agentId()!} onAgentChange={setAgentId} disabled={!activeConversationId()} />
                </Panel>
            </Show>
        </Scrollable>
    </ChatSplit>)
}
