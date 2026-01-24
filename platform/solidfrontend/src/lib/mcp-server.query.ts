import {
    createQuery,
    createMutation,
    useQueryClient,
} from "@tanstack/solid-query";
import { archestraApiSdk, type archestraApiTypes } from "@shared";

const {
    getMcpServers,
    getMcpServer,
    getMcpServerTools,
    getMcpServerLogs,
    installMcpServer,
    deleteMcpServer,
    restartMcpServer,
} = archestraApiSdk;

export function useMcpServers(params?: { catalogId?: string }) {
    return createQuery(() => ({
        queryKey: params?.catalogId
            ? ["mcp-servers", { catalogId: params.catalogId }]
            : ["mcp-servers"],
        queryFn: async () => {
            const response = await getMcpServers({
                query: params?.catalogId
                    ? { catalogId: params.catalogId }
                    : undefined,
            });
            return response.data ?? [];
        },
    }));
}

export function useMcpServer(id: () => string | null) {
    return createQuery(() => ({
        queryKey: ["mcp-servers", id()],
        queryFn: async () => {
            const serverId = id();
            if (!serverId) return null;
            const response = await getMcpServer({ path: { id: serverId } });
            return response.data ?? null;
        },
        enabled: !!id(),
    }));
}

export function useMcpServerTools(mcpServerId: () => string | null) {
    return createQuery(() => ({
        queryKey: ["mcp-servers", mcpServerId(), "tools"],
        queryFn: async () => {
            const id = mcpServerId();
            if (!id) return [];
            const response = await getMcpServerTools({ path: { id } });
            return response.data ?? [];
        },
        enabled: !!mcpServerId(),
    }));
}

export function useMcpServerLogs(mcpServerId: () => string | null) {
    return createQuery(() => ({
        queryKey: ["mcp-servers", mcpServerId(), "logs"],
        queryFn: async () => {
            const id = mcpServerId();
            if (!id) return null;
            const response = await getMcpServerLogs({
                path: { id },
                query: { lines: 100 },
            });
            return response.data ?? null;
        },
        enabled: !!mcpServerId(),
    }));
}

export function useInstallMcpServer() {
    const queryClient = useQueryClient();
    return createMutation(() => ({
        mutationFn: async (
            data: archestraApiTypes.InstallMcpServerData["body"],
        ) => {
            const { data: installedServer, error } = await installMcpServer({
                body: data,
            });
            if (error) {
                throw new Error(
                    typeof error.error === "string"
                        ? error.error
                        : error.error?.message || "Unknown error",
                );
            }
            return installedServer;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["mcp-servers"] });
        },
    }));
}

export function useDeleteMcpServer() {
    const queryClient = useQueryClient();
    return createMutation(() => ({
        mutationFn: async (data: { id: string }) => {
            const response = await deleteMcpServer({ path: { id: data.id } });
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["mcp-servers"] });
        },
    }));
}

export function useRestartMcpServer() {
    const queryClient = useQueryClient();
    return createMutation(() => ({
        mutationFn: async (data: { id: string }) => {
            const response = await restartMcpServer({ path: { id: data.id } });
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["mcp-servers"] });
        },
    }));
}
