/**
 * Retrieves and verifies QR code from podman container logs of a local WhatsApp MCP connector
 */
import WebSocketService from "@backend/websocket";
import log from "@backend/utils/logger";
import {type LogMonitor, type GetLogs} from "./mcp-setup-registry";

type MatcherFunction = (logs: string) => { match: string, date?: Date } | false
const qrCodeMatcher: MatcherFunction = (logs: string): { match: string, date?: Date } | false => {
  const [chunk] = logs.split("\n").reverse().join("\n").match(/((?:^[0-9\-T:+]+\s+[█▄▀ ]+.*\n?)+)/gm) || [];
  if (chunk) {
    const code = chunk.split("\n").reverse().map(line => line.replace(/[^█▄▀ \n]/g, '').trim()).filter(Boolean).join("\n")
    const date = new Date(chunk.split("\n")[0]?.split(/\s/)?.[0]);
    return code ? { match: code, date: date && !isNaN(date.getTime()) ? date : undefined } : false;
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
    const {index} = lines.reduce(({ date: closestDate, index: closestIndex}: { date?: Date, index: number }, line, index) => {
      const date: Date = new Date(line.split(/\s/)[0]);
      const diff = date.getTime() - cutoffAt.getTime();
      const closestTime = closestDate ? closestDate.getTime() : Infinity
      return diff >= 0 && diff < closestTime - cutoffAt.getTime()
        ? { date, index }
        : { date: closestDate, index: closestIndex }
    }, { date: undefined, index: -1 });
    return index === -1 ? '' : lines.slice(index).join("\n");
  }
}

export const whatsappQrCodeMonitor: LogMonitor = function (serverId: string, getLogs: GetLogs, { startAt: startAtDefault }: { startAt?: Date } = {}) {
  const startAt = startAtDefault || new Date(Date.now() - 60000);
  log.info('WhatsApp MCP log monitor: get logs starting at date', startAt);
  const waitFor = (lookup: string | MatcherFunction, timeout = 20000, cutoffAt = undefined)
    : Promise<{ match: string, date: Date }> => {
    return new Promise((resolve, reject) => {
      let timer;
      function pollLogs() {
        getLogs(100).then((log) => {
          const matcher = typeof lookup === 'function' ? lookup : defaultMatcher.bind(null, lookup);
          const chunk = cutoffAt ? getLogsFromDate(log, cutoffAt) : log;
          const match = matcher(chunk);
          if (match) {
            resolve(match);
          } else {
            timer = setTimeout(pollLogs, 1000);
          }
        }).catch(() => {
          timer = setTimeout(pollLogs, 1000);
        });
      }
      pollLogs();
      setTimeout(() => {
        clearTimeout(timer);
        const lookupString = lookup === qrCodeMatcher
          ? 'qrCodeMatcher'
          : typeof lookup === 'string'
            ? lookup
            : 'function'

        reject(`WhatsApp MCP log monitor: timeout out waiting for "${lookupString}"`)
      }, timeout)
    })
  }

  waitFor(qrCodeMatcher, 60000, startAt)
    .then(async ({ match: qrCodeASCII, date }) => {
      let paired = false;
      let scanTimedOut = false;

      log.info('WhatsApp MCP log monitor: QR code detected', { code: qrCodeASCII, date});
      WebSocketService.broadcast({
        type: 'mcp-setup',
        payload: {serverId, provider: 'whatsapp', status: 'pending', content: qrCodeASCII},
      });

      // Waits for the indication of device pair success
      waitFor('Successfully paired', 300000, date).then(({ date }) => {
        log.info('WhatsApp MCP log monitor: device paired', { date });
        paired = true;
        WebSocketService.broadcast({
          type: 'mcp-setup',
          payload: {serverId, provider: 'whatsapp', status: 'success',},
        })
      }).catch(log.error);

      // Waits for the indication of device pair timeout
      waitFor('Timeout waiting for QR code scan', 1000000, date).then(({ date }) => {
        log.info('WhatsApp MCP log monitor: QR code timeout', { date });
        scanTimedOut = true;
        WebSocketService.broadcast({
          type: 'mcp-setup',
          payload: {serverId, provider: 'whatsapp', status: 'error',},
        })
      }).catch(log.error);

      let updatesExhausted = false;
      // Waits for QR code updates. Make sure to start looking from entries which are at least some second newer
      // to avoid matching the same QR code over and over.
      let startQRCodeAt = new Date(date.getTime() + 3000);
      while (!updatesExhausted && !paired && !scanTimedOut) {
        try {
          const { match: qrCodeASCII, date } = await waitFor(qrCodeMatcher, 300000, startQRCodeAt)
          log.info('WhatsApp MCP log monitor: QR code update', { code: qrCodeASCII, date: startQRCodeAt });
          startQRCodeAt = new Date(date.getTime() + 3000);
          WebSocketService.broadcast({
            type: 'mcp-setup',
            payload: {serverId, provider: 'whatsapp', status: 'pending', content: qrCodeASCII},
          });
        } catch (exception) {
          updatesExhausted = true;
          log.error(exception)
        }
      }
    })
    .catch(log.error);
}


