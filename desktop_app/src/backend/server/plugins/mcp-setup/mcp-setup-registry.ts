import {whatsAppLogMonitor} from "@backend/server/plugins/mcp-setup/whatsapp-log-monitor";
import {type LogMonitorProvider} from "@backend/database/schema/mcpServer";

export type GetLogs = (lines?: number) => Promise<string>
export type LogMonitor = (getLogs: GetLogs, startAt?: Date) => void;

export const mcpLogMonitorRegistry: Record<LogMonitorProvider, LogMonitor> = {
  whatsapp: whatsAppLogMonitor,
};
