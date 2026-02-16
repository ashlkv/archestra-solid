import { archestraApiSdk, type archestraApiTypes } from "@shared";
import { revalidate } from "@solidjs/router";
import { showError, showToast } from "@/components/primitives/Toast";
import { createSubmission, getAuthHeaders } from "@/lib/api";

type InstallMcpServerPayload = archestraApiTypes.InstallMcpServerData["body"];

const installMcpServer = createSubmission({
    callback: async (payload: InstallMcpServerPayload) => {
        return archestraApiSdk.installMcpServer({
            headers: getAuthHeaders(),
            body: payload,
        });
    },
    onSuccess: () => {
        revalidate("fetch-mcp-servers");
        revalidate("fetch-tools");
        showToast({ title: "Server installed" });
    },
    onError: (exception) => showError(exception.message),
});

export function useInstallMcpServer() {
    return installMcpServer();
}

type DeleteMcpServerPayload = { id: string; name: string };

const deleteMcpServer = createSubmission({
    callback: async (payload: DeleteMcpServerPayload) => {
        return archestraApiSdk.deleteMcpServer({
            headers: getAuthHeaders(),
            path: { id: payload.id },
        });
    },
    onSuccess: () => {
        revalidate("fetch-mcp-servers");
        revalidate("fetch-tools");
        showToast({ title: "Server uninstalled" });
    },
    onError: (exception) => showError(exception.message),
});

export function useDeleteMcpServer() {
    return deleteMcpServer();
}
