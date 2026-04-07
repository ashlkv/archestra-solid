import type { SupportedProvider } from "@shared";
import { useParams } from "@solidjs/router";
import type { UIMessage } from "ai";
import { createEffect, createSignal, type JSX, on, onCleanup, onMount, Show } from "solid-js";
import { useConversation } from "@/chat/chat.query";
import { useChatModels } from "@/chat/chat-models.query";
import { AgentSettings } from "@/chat/components/AgentSettings";
import { ChatContentSplit } from "@/chat/components/ChatContentSplit";
import { ChatMessages } from "@/chat/components/ChatMessages";
import { ChatSkeleton } from "@/chat/components/ChatSkeleton";
import { ChatSplit } from "@/chat/components/ChatSplit";
import { ChatToolsDisplay } from "@/chat/components/ChatToolsDisplay";
import { LlmSelectorGroup } from "@/chat/components/LlmSelectorGroup";
import { PromptInput } from "@/chat/components/PromptInput";
import { type ChatSession, createChat } from "@/chat/create-chat";
import { useAgents } from "@/lib/agent.query";
import { Column } from "@/primitives/Column";
import { Panel } from "@/primitives/Panel";
import { Scrollable } from "@/primitives/Scrollable";
import { useChatContext } from '~/chat/ChatContext';

export default function ActiveChatPage(): JSX.Element {
    const params = useParams<{ chatId: string }>();
    const { scheduleCleanup, cancelCleanup, getChat } = useChatContext()

    const [agentId, setAgentId] = createSignal<string | undefined>(undefined, { name: "agentId" });
    const [selectedModel, setSelectedModel] = createSignal<string>("", { name: "selectedModel" });
    const [selectedApiKeyId, setSelectedApiKeyId] = createSignal<string | undefined>(undefined, {
        name: "selectedApiKeyId",
    });
    const [chatSession, setChatSession] = createSignal<ChatSession | undefined>(undefined, { name: "chatSession" });

    const { data: agents } = useAgents(undefined as undefined);
    const { data: chatModels } = useChatModels(undefined as undefined);
    const chat = useConversation(() => params.chatId);

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

    // When chat data loads, apply its saved agent/model/key
    // and create a chat session with the message history.
    createEffect(
        on(
            () => chat.data(),
            function initializeFromChat(chatData) {
                if (!chatData) return;

                setAgentId(chatData.agentId ?? undefined);
                if (chatData.selectedModel) {
                    setSelectedModel(chatData.selectedModel);
                }
                if (chatData.chatApiKeyId) {
                    setSelectedApiKeyId(chatData.chatApiKeyId);
                }

                const session = getChat({
                    id: params.chatId,
                    initialMessages: (chatData.messages as UIMessage[]) ?? [],
                    onError: (error) => {
                        console.error("[ActiveChatPage] Stream error:", error);
                    },
                });

                setChatSession(session);

                // Send pending prompt passed via navigation state
                const pendingPrompt = history.state?.pendingPrompt as string | undefined;
                if (pendingPrompt) {
                    // Clear the state so a page refresh doesn't re-send
                    history.replaceState({ ...history.state, pendingPrompt: undefined }, "");
                    session.sendMessage(pendingPrompt);
                }
            },
        ),
    );

    const onSubmit = (text: string) => {
        chatSession()?.sendMessage(text);
    };

    const onStop = () => {
        chatSession()?.stop();
    };

    const ready = () => !!chatSession();

    onMount(function scheduleChatCleanup() {
        cancelCleanup(params.chatId);
    });
    onCleanup(function scheduleChatCleanup() {
        scheduleCleanup(params.chatId);
    })

    return (
        <ChatSplit>
            <Scrollable>
                <Show when={!ready()}>
                    <ChatSkeleton />
                </Show>
                <Show when={ready()}>
                    <ChatContentSplit>
                        <Scrollable>
                            <ChatMessages
                                messages={() => chatSession()?.messages() ?? []}
                                status={() => chatSession()?.status() ?? "ready"}
                                error={() => chatSession()?.error()}
                                agentName={agentName()}
                            />
                        </Scrollable>
                        <Column>
                            <PromptInput
                                onSubmit={onSubmit}
                                onStop={onStop}
                                status={chatSession()?.status() ?? "ready"}
                                disabled={false}
                                placeholder={`Message ${agentName() ?? "assistant"}...`}
                                headerContent={
                                    agentId() ? (
                                        <ChatToolsDisplay agentId={agentId()!} chatId={params.chatId} />
                                    ) : undefined
                                }
                                footerLeft={
                                    <LlmSelectorGroup
                                        selectedKeyId={selectedApiKeyId()}
                                        onKeyChange={setSelectedApiKeyId}
                                        currentProvider={selectedModelProvider()}
                                        selectedModel={selectedModel()}
                                        onModelChange={setSelectedModel}
                                        disabled={false}
                                        size="small"
                                    />
                                }
                            />
                        </Column>
                    </ChatContentSplit>
                </Show>
            </Scrollable>
            <Scrollable>
                <Show when={agentId()}>
                    <Panel fullHeight>
                        <AgentSettings agentId={agentId()!} onAgentChange={setAgentId} disabled={false} />
                    </Panel>
                </Show>
            </Scrollable>
        </ChatSplit>
    );
}
