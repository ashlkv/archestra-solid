/**
 * Retrieves and verifies QR code from podman container logs of a local WhatsApp MCP connector
 */
import WebSocketService from "@backend/websocket";
import {type LogMonitor, type GetLogs} from "./mcp-setup-registry";

type MatcherFunction = (logs: string) => { match: string, date?: Date } | false
const qrCodeMatcher: MatcherFunction = (logs: string): { match: string, date?: Date } | false => {
  const [chunk] = logs.split("\n").reverse().join("\n").match(/((?:^[0-9\-T:+]+\s+[█▄▀ ]+.*\n?)+)/gm) || [];
  if (chunk) {
    const code = chunk.split("\n").reverse().map(line => line.replace(/[^█▄▀ \n]/g, '').trim()).filter(Boolean).join("\n")
    const date = new Date(chunk.split("\n")[0]?.split(/\s/)?.[0]);
    return { match: code, date: date && !isNaN(date.getTime()) ? date : undefined }
  } else {
    return false;
  }
}

const defaultMatcher = (string: string, logs: string): { match: string, date?: Date } | false => {
  const line = logs.split("\n").find(line => line.includes(string));
  if (line) {
    const date = new Date(line.split(/\s/)[0]);
    return { match: string, date: date && !isNaN(date.getTime()) ? date : undefined }
  } else {
    return false
  }
}

export const getLogsFromDate = (logs: string, cutoffAt: Date): string => {
  const lines = logs.split("\n");
  const oldestDate = new Date(lines[0].split(/\s/)[0]);
  const newestDate = new Date(lines[lines.length - 1].split(/\s/)[0]);
  if (cutoffAt < oldestDate) {
    return logs;
  } else if (cutoffAt > newestDate) {
    return '';
  } else {
    const {index} = lines.reduce(({ date: closestDate, index: closestIndex}, line, index) => {
      const date: Date = new Date(line.split(/\s/)[0]);
      return Math.abs(closestDate.getTime() - cutoffAt.getTime()) > Math.abs(date.getTime() - cutoffAt.getTime())
        ? { date, index }
        : { date: closestDate, index: closestIndex }
    }, { date: new Date(0), index: -1 });
    return index === -1 ? '' : lines.slice(index).join("\n");
  }
}

export const whatsAppLogMonitor: LogMonitor = function (getLogs: GetLogs, startAtDefault?: Date) {
  const startAt = startAtDefault || new Date(Date.now() - 60000);
  const waitFor = (lookup: string | MatcherFunction, timeout = 20000, cutoffAt = undefined): Promise<{ match: string, date: string }> => {
    const fulfilled = new Promise((resolve) => {
      function pollLogs() {
        getLogs(100).then((log) => {
          const matcher = typeof lookup === 'function' ? lookup : defaultMatcher.bind(null, lookup);
          const chunk = cutoffAt ? getLogsFromDate(log, cutoffAt) : log;
          const match = matcher(chunk);
          if (match) {
            resolve(match);
          } else {
            setTimeout(pollLogs, 1000);
          }
        });
      }
      pollLogs();
    })
    const timedOut = new Promise((resolve, reject) => setTimeout(reject, timeout))
    return Promise.race([fulfilled, timedOut])
  }

  waitFor(qrCodeMatcher, 60000, startAt)
    .then(({ match: qrCodeASCII, date: startingAt }) => {
      if (!qrCodeASCII) {
        return;
      }
      WebSocketService.broadcast({
        type: 'mcp-setup',
        payload: {
          provider: 'whatsapp',
          type: 'qrcode',
          status: 'detected',
          content: qrCodeASCII
        },
      });

      waitFor('Successfully paired', 300000, startingAt).then(() => {
        WebSocketService.broadcast({
          type: 'mcp-setup',
          payload: {
            provider: 'whatsapp',
            type: 'qrcode',
            status: 'verified',
          },
        })
      });

      waitFor('Timeout waiting for QR code scan', 1000000, startingAt).then(() => {
        WebSocketService.broadcast({
          type: 'mcp-setup',
          payload: {
            provider: 'whatsapp',
            type: 'qrcode',
            status: 'timeout',
          },
        })
      })
    });
}


