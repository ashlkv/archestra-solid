import { type archestraApiTypes } from "@shared";

export type MCP = NonNullable<archestraApiTypes.GetInternalMcpCatalogResponses["200"]>[number];

export type Tool =
    NonNullable<archestraApiTypes.GetToolsWithAssignmentsResponses["200"]["data"]>[number];

export type ToolWithAssignments = Tool;

export type ToolsQueryParams =
    archestraApiTypes.GetToolsWithAssignmentsData["query"];

export type CallPolicy =
    archestraApiTypes.GetToolInvocationPoliciesResponses["200"][number];

export type ResultPolicy =
    archestraApiTypes.GetTrustedDataPoliciesResponses["200"][number];

export type ResultPolicyAction = ResultPolicy["action"];
