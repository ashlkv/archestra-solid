import type { archestraApiTypes } from "@shared";

export type MCP = NonNullable<archestraApiTypes.GetInternalMcpCatalogResponses["200"]>[number];

export type McpServer = NonNullable<archestraApiTypes.GetMcpServersResponses["200"]>[number];

export type Tool = NonNullable<archestraApiTypes.GetToolsWithAssignmentsResponses["200"]["data"]>[number];

export type ToolWithAssignments = Tool;

export type ToolsQueryParams = archestraApiTypes.GetToolsWithAssignmentsData["query"];

export type CallPolicy = archestraApiTypes.GetToolInvocationPoliciesResponses["200"][number];

export type ResultPolicy = archestraApiTypes.GetTrustedDataPoliciesResponses["200"][number];

export type ResultPolicyAction = ResultPolicy["action"];

export type Team = NonNullable<archestraApiTypes.GetTeamsResponses["200"]>[number];

export type InstallMcpServerPayload = archestraApiTypes.InstallMcpServerData["body"];

export type UserConfigType = Record<
    string,
    {
        type: "string" | "number" | "boolean" | "directory" | "file";
        title: string;
        description: string;
        required?: boolean;
        default?: string | number | boolean | Array<string>;
        multiple?: boolean;
        sensitive?: boolean;
        min?: number;
        max?: number;
    }
>;

export type LocalServerInstallResult = {
    environmentValues: Record<string, string>;
    teamId?: string | null;
    serviceAccount?: string;
};

export type RemoteServerInstallResult = {
    metadata: Record<string, unknown>;
    teamId?: string | null;
};

export type NoAuthInstallResult = {
    teamId?: string | null;
};

export type Interaction = archestraApiTypes.GetInteractionsResponses["200"]["data"][number];

export type SessionData = archestraApiTypes.GetInteractionSessionsResponses["200"]["data"][number];

export type McpToolCallData = archestraApiTypes.GetMcpToolCallsResponses["200"]["data"][number];

export type DualLlmResult = archestraApiTypes.GetDualLlmResultsByInteractionResponses["200"][number];

export type Agent = { id: string; name: string };

export type Conversation = NonNullable<archestraApiTypes.GetChatConversationResponses["200"]>;

export type ConversationListItem = NonNullable<archestraApiTypes.GetChatConversationsResponses["200"]>[number];

export type ChatModel = archestraApiTypes.GetChatModelsResponses["200"][number];

export type ModelCapabilities = NonNullable<ChatModel["capabilities"]>;

export type ChatApiKey = archestraApiTypes.GetAvailableChatApiKeysResponses["200"][number];

export type ChatApiKeyScope = ChatApiKey["scope"];

export type ChatToolItem = {
    id: string;
    name: string;
    description: string | null;
};
