import {whatsappQrCodeMonitor} from "@backend/server/plugins/mcp-setup/whatsapp-qr-code-monitor";
import {type LogMonitorProvider} from "@backend/database/schema/mcpServer";

export type GetLogs = (lines?: number) => Promise<string>
export type LogMonitor = (serverId, getLogs: GetLogs, options?: { startAt?: Date
}) => void;

export const mcpLogMonitorRegistry: Record<LogMonitorProvider, LogMonitor> = {
  whatsapp: whatsappQrCodeMonitor,
};
