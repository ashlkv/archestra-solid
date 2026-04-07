import { archestraApiSdk, type SupportedProvider } from "@shared";
import { useNavigate } from "@solidjs/router";
import { createEffect, createSignal, type JSX, on, Show } from "solid-js";
import { getAuthHeaders } from "@/api";
import { useChatModels } from "@/chat/chat-models.query";
import { AgentSettings } from "@/chat/components/AgentSettings";
import { ChatContentSplit } from "@/chat/components/ChatContentSplit";
import { ChatSplit } from "@/chat/components/ChatSplit";
import { ChatToolsDisplay } from "@/chat/components/ChatToolsDisplay";
import { LlmSelectorGroup } from "@/chat/components/LlmSelectorGroup";
import { PromptInput } from "@/chat/components/PromptInput";
import { useAgents } from "@/lib/agent.query";
import { Column } from "@/primitives/Column";
import { Panel } from "@/primitives/Panel";
import { Scrollable } from "@/primitives/Scrollable";
import { showError } from "@/primitives/Toast";

export default function NewChatPage(): JSX.Element {
    const navigate = useNavigate();

    const [agentId, setAgentId] = createSignal<string | undefined>(undefined, { name: "agentId" });
    const [selectedModel, setSelectedModel] = createSignal<string>("", { name: "selectedModel" });
    const [selectedApiKeyId, setSelectedApiKeyId] = createSignal<string | undefined>(undefined, {
        name: "selectedApiKeyId",
    });
    const [creating, setCreating] = createSignal(false, { name: "creating" });

    const { data: agents } = useAgents(undefined as undefined);
    const { data: chatModels } = useChatModels(undefined as undefined);

    createEffect(
        on(
            () => agents(),
            function autoSelectFirstAgent(agentList) {
                if (agentId() || !agentList?.length) return;
                setAgentId(agentList[0].id);
            },
        ),
    );

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

    const onSubmit = async (text: string) => {
        const selectedAgentId = agentId();
        if (!selectedAgentId) return;

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
                navigate(`/chat/${response.data.id}`, { state: { pendingPrompt: text } });
            } else {
                const errorObj = response.error as { error?: { message?: string }; message?: string } | undefined;
                const errorMessage = errorObj?.error?.message ?? errorObj?.message ?? "Failed to create chat";
                showError(typeof errorMessage === "string" ? errorMessage : "Failed to create chat");
            }
        } catch (exception) {
            console.error("[NewChatPage] Failed to create chat:", exception);
            showError("Failed to create chat");
        } finally {
            setCreating(false);
        }
    };

    return (
        <ChatSplit>
            <Scrollable>
                <ChatContentSplit>
                    <Scrollable />
                    <Column>
                        <PromptInput
                            onSubmit={onSubmit}
                            status={creating() ? "submitted" : "ready"}
                            disabled={!agentId()}
                            placeholder={
                                agentId()
                                    ? `Message ${agentName() ?? "assistant"}...`
                                    : "Select an agent to start chatting"
                            }
                            headerContent={
                                agentId() ? <ChatToolsDisplay agentId={agentId()!} chatId={undefined} /> : undefined
                            }
                            footerLeft={
                                <LlmSelectorGroup
                                    selectedKeyId={selectedApiKeyId()}
                                    onKeyChange={setSelectedApiKeyId}
                                    currentProvider={selectedModelProvider()}
                                    selectedModel={selectedModel()}
                                    onModelChange={setSelectedModel}
                                    disabled={true}
                                    size="small"
                                />
                            }
                        />
                    </Column>
                </ChatContentSplit>
            </Scrollable>
            <Scrollable>
                <Show when={agentId()}>
                    <Panel fullHeight>
                        <AgentSettings agentId={agentId()!} onAgentChange={setAgentId} disabled={true} />
                    </Panel>
                </Show>
            </Scrollable>
        </ChatSplit>
    );
}
