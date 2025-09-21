import { describe, it, expect, vi, beforeEach } from 'vitest';
import { whatsAppLogMonitor } from './whatsapp-log-monitor';

const logsWithQRCode = `2025-09-19T09:39:56+02:00 Scan this QR code with your WhatsApp app:
2025-09-19T09:39:56+02:00 █████████████████████████████████████████████████████████████████
2025-09-19T09:39:56+02:00 █████████████████████████████████████████████████████████████████
2025-09-19T09:39:56+02:00 ████ ▄▄▄▄▄ ██  ▀ ▀▀▄▄█▀ ▄▀▀▀▄▀ █   ▄ ▄  ▄  ▀█ ▄ ▄█▄ ██ ▄▄▄▄▄ ████
2025-09-19T09:39:56+02:00 ████ █   █ █▄▀█▀▀▄▄████▀▄█▄▄▄█▄▄▄▀█▄▄▄█▄█ ▀█▄▀ ▄▄▀▄ ██ █   █ ████
2025-09-19T09:39:56+02:00 ████ █▄▄▄█ ██▀▀  ▄▄█▄█▄ ▀ ▀█▄▀ ▄▄▄     ▄██ █ █ █▀ ▀▄██ █▄▄▄█ ████
2025-09-19T09:39:56+02:00 ████▄▄▄▄▄▄▄█ █ █▄▀ ▀▄█ █ ▀ ▀▄▀ █▄█ █▄█ █ ▀▄█ ▀ ▀▄█▄█ █▄▄▄▄▄▄▄████
2025-09-19T09:39:56+02:00 ████  ▄█  ▄  ▀▄▀▄  ▄█▄ ▄█▄▄█▄ ▄▄▄ ▄█▄ ▄█▄██▄▄██▄▄████▄▄▀█▀▄▀▀████
2025-09-19T09:39:56+02:00 █████▀▀ ▀▄▄▀▄▀█▀▀ ▀█ █▄█  ▀▀▄ ▄▄▀▄▀▀▄▀▄▀▀ █▀█▀▀█▀ ▄ ▀█▀█ ██  ████
2025-09-19T09:39:56+02:00 ████▄█▄▄▄█▄█▀▄  █ ████▄██ ███ █▀ █▀  ▄█  ██ ▄▄▄▄ ▄█▄██▄█ ▀▄▄ ████
2025-09-19T09:39:56+02:00 ████ ▀█  ▄▄▀ ▄▀  █▄▀  ▄  █▀▀ ██ ██▄▀█ ▄██▄▄▀ █▀█ ▀▀▀▀ ▀▀█▀██▄████
2025-09-19T09:39:56+02:00 ████▀▄▀▄ █▄ █▄▀██ ▄▄▄   █  ██▀  ▀▄█▄▄ █  █▄ ▄███▄▄▄▄█▄▄▄▄ ▀█▄████
2025-09-19T09:39:56+02:00 ████▀█▄█▀ ▄▀▄   ▄█▄▀ ▀ ████  ▄█ █▀ █▀ ▀ ▄▀█▀█ █▀██▀  ▀▀▀██▄▄▄████
2025-09-19T09:39:56+02:00 █████▀▄ ▀▄▄▄█▄▀▀▄█▄█ ▄▄ ▄█ █ ▄▀  ██  ██▄ ▀█▄▄▄█▄ █▄ ██▄ ▄▀ ▄ ████
2025-09-19T09:39:56+02:00 █████▄▀█▀ ▄▀▀▀█▀▀▀██▀▄  ▄▄ █▀█▀   █ ▄▄ ▀▄ █▄█▄█▄ ▄▄▄██ ▄  ▄█▄████
2025-09-19T09:39:56+02:00 ████  █▀ ▀▄ █ ▄█  ▀█▄█ ▀█  ▄▄█▄▄▄█▄ ▀█▀ ▄▄█▄▄▄█▄▄▄█▀██▄█ ▀█▄█████
2025-09-19T09:39:56+02:00 ████  █▀ ▄▄▄   ▀▀ ▄█▀ ▀▄ █▄▀   ▄▄▄  ▀█▄█▀ ▀▄ █▄▄ █ ▄ ▄▄▄ █▄▄▄████
2025-09-19T09:39:56+02:00 ████▀  ▄ █▄█  ▄▄▄▄▀█▄ █▄▄█▄▄██ █▄█  ▄ █  ▄▄  ▄▄█ ▄██ █▄█ ██▄▀████
2025-09-19T09:39:56+02:00 ██████▄   ▄▄▄ ▀▀ ▀  ▀▀▀    ▀  ▄▄  ▄▄ ▄▀ ▀▀▀█▄ ▄ ▄█▀▄ ▄  ▄▀█ ▄████
2025-09-19T09:39:56+02:00 ████ █▄█▄ ▄▀▄▄▄█ █▀█▄ ▄▄█▄ █▄▀▀█▄█▄▀  ▄  ██   ▄▄ ▄█▀█▄▄██ ██▀████
2025-09-19T09:39:56+02:00 ████▀█▄██▄▄▀ ▀▀ █▄▄▀▀▀█ ██▄▀   █▄█▄▄ ▀█ ▄▀▄▀  ██  █ ▀▀ ▀ ▄█▀ ████
2025-09-19T09:39:56+02:00 ████▀█▀▀██▄███▄   █ ▄ ▄█    ▄ █ ▄ ▀  ▄▄▄ ▄█▄▄▄██ ▄▄▀  ▄▄█▄▀  ████
2025-09-19T09:39:56+02:00 ██████▄▄ ▀▄▀ █▀ ▄▄  ▄▀▄█▀▀▀ ▄ ▀ ▄▄ █▄▀██ ▀▀▀  █▄▄▄ █▀  ██▄█ █████
2025-09-19T09:39:56+02:00 █████▄ █▀ ▄▀ █ ▀▀████▄  █▄▄▄█▀ █▄ ▄█▄ ▄   ▄ ▄██  █▄▀▀ ▀█▄ ▄▀▄████
2025-09-19T09:39:56+02:00 ██████ ▀▄▀▄▀ ▄▄  ▄▄█▄█▄   ▀███  ▄  █▄  ▀  ▀ ▄ ▄▄ ▄ █▄ ▄▀▄██  ████
2025-09-19T09:39:56+02:00 ████▀▄▀▀██▄▀▀▄ ▀▄ ████▄▄█ █ █ ▄█▄▀█ ▄█▄▄ ▀▄▄▄ ▄▀▄████▀ ▄█▀▀█▀████
2025-09-19T09:39:56+02:00 ████ ▀ ▀▀▄▄█ ▀ ███  ▀█▄▄██ ▄▄▀▀███ ▀██▀█ ▄██  █▀▀▀▄█▀  ▀▄█▄█ ████
2025-09-19T09:39:56+02:00 ██████████▄█ █▀ ▄█ █▄█ █▄ ▄█▄  ▄▄▄   ▀▄▀ ██  ▄█▄ ███ ▄▄▄   ▀ ████
2025-09-19T09:39:56+02:00 ████ ▄▄▄▄▄ █ ███▄▄▀▀▄▄██▄█▀▀   █▄█ ▀ ▄▀▀▀▄ ▀▄▄█ ▀▀█▀ █▄█  ▄▄▄████
2025-09-19T09:39:56+02:00 ████ █   █ █▄▄ █ █▀█  ▄ ▄  █ ▄ ▄ ▄ ▄▄██▄▄▀█▄ ▀█ ▄█▄▄ ▄    ▀▀█████
2025-09-19T09:39:56+02:00 ████ █▄▄▄█ █ █▀▀▀█ █▀▀█ ▄█▄█▀▄▄ ▄█▀▀██ █  ██  ▀▀███▄ ▄█▄▄▄▄▀▄████
2025-09-19T09:39:56+02:00 ████▄▄▄▄▄▄▄█▄▄▄▄▄▄▄▄█▄▄▄▄▄▄█▄▄▄███▄▄████▄▄██▄██▄▄█████▄█▄██▄▄████
2025-09-19T09:39:56+02:00 █████████████████████████████████████████████████████████████████
2025-09-19T09:39:56+02:00 ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
2025-09-19T09:40:16+02:00`

const pairedAfterCode = `2025-09-19T09:39:56+02:00 ████████
2025-09-19T09:39:56+02:00 ████████
2025-09-19T09:39:56+02:00 ████████
2025-09-19T09:40:16+02:00 Successfully paired`

const pairedBeforeCode = `2025-09-18T00:00:01+02:00 Successfully paired
2025-09-19T09:39:56+02:00 ████████
2025-09-19T09:39:56+02:00 ████████
2025-09-19T09:39:56+02:00 ████████
2025-09-19T09:40:16+02:00 `

const logsWith2QRCodes = `2025-09-19T09:39:56+02:00 Scan this QR code with your WhatsApp app:
2025-09-19T09:39:56+02:00 ████████
2025-09-19T09:39:56+02:00 ████████
2025-09-19T09:39:56+02:00 ████████
2025-09-19T09:39:57+02:00 Scan this QR code with your WhatsApp app:
2025-09-19T09:39:57+02:00 ████████
2025-09-19T09:39:57+02:00 █ ▄▄▄▄ █
2025-09-19T09:39:57+02:00 ████████
2025-09-19T09:39:58+02:00`

const lastQRCode = `████████
█ ▄▄▄▄ █
████████`;

const qrCode = `█████████████████████████████████████████████████████████████████
█████████████████████████████████████████████████████████████████
████ ▄▄▄▄▄ ██  ▀ ▀▀▄▄█▀ ▄▀▀▀▄▀ █   ▄ ▄  ▄  ▀█ ▄ ▄█▄ ██ ▄▄▄▄▄ ████
████ █   █ █▄▀█▀▀▄▄████▀▄█▄▄▄█▄▄▄▀█▄▄▄█▄█ ▀█▄▀ ▄▄▀▄ ██ █   █ ████
████ █▄▄▄█ ██▀▀  ▄▄█▄█▄ ▀ ▀█▄▀ ▄▄▄     ▄██ █ █ █▀ ▀▄██ █▄▄▄█ ████
████▄▄▄▄▄▄▄█ █ █▄▀ ▀▄█ █ ▀ ▀▄▀ █▄█ █▄█ █ ▀▄█ ▀ ▀▄█▄█ █▄▄▄▄▄▄▄████
████  ▄█  ▄  ▀▄▀▄  ▄█▄ ▄█▄▄█▄ ▄▄▄ ▄█▄ ▄█▄██▄▄██▄▄████▄▄▀█▀▄▀▀████
█████▀▀ ▀▄▄▀▄▀█▀▀ ▀█ █▄█  ▀▀▄ ▄▄▀▄▀▀▄▀▄▀▀ █▀█▀▀█▀ ▄ ▀█▀█ ██  ████
████▄█▄▄▄█▄█▀▄  █ ████▄██ ███ █▀ █▀  ▄█  ██ ▄▄▄▄ ▄█▄██▄█ ▀▄▄ ████
████ ▀█  ▄▄▀ ▄▀  █▄▀  ▄  █▀▀ ██ ██▄▀█ ▄██▄▄▀ █▀█ ▀▀▀▀ ▀▀█▀██▄████
████▀▄▀▄ █▄ █▄▀██ ▄▄▄   █  ██▀  ▀▄█▄▄ █  █▄ ▄███▄▄▄▄█▄▄▄▄ ▀█▄████
████▀█▄█▀ ▄▀▄   ▄█▄▀ ▀ ████  ▄█ █▀ █▀ ▀ ▄▀█▀█ █▀██▀  ▀▀▀██▄▄▄████
█████▀▄ ▀▄▄▄█▄▀▀▄█▄█ ▄▄ ▄█ █ ▄▀  ██  ██▄ ▀█▄▄▄█▄ █▄ ██▄ ▄▀ ▄ ████
█████▄▀█▀ ▄▀▀▀█▀▀▀██▀▄  ▄▄ █▀█▀   █ ▄▄ ▀▄ █▄█▄█▄ ▄▄▄██ ▄  ▄█▄████
████  █▀ ▀▄ █ ▄█  ▀█▄█ ▀█  ▄▄█▄▄▄█▄ ▀█▀ ▄▄█▄▄▄█▄▄▄█▀██▄█ ▀█▄█████
████  █▀ ▄▄▄   ▀▀ ▄█▀ ▀▄ █▄▀   ▄▄▄  ▀█▄█▀ ▀▄ █▄▄ █ ▄ ▄▄▄ █▄▄▄████
████▀  ▄ █▄█  ▄▄▄▄▀█▄ █▄▄█▄▄██ █▄█  ▄ █  ▄▄  ▄▄█ ▄██ █▄█ ██▄▀████
██████▄   ▄▄▄ ▀▀ ▀  ▀▀▀    ▀  ▄▄  ▄▄ ▄▀ ▀▀▀█▄ ▄ ▄█▀▄ ▄  ▄▀█ ▄████
████ █▄█▄ ▄▀▄▄▄█ █▀█▄ ▄▄█▄ █▄▀▀█▄█▄▀  ▄  ██   ▄▄ ▄█▀█▄▄██ ██▀████
████▀█▄██▄▄▀ ▀▀ █▄▄▀▀▀█ ██▄▀   █▄█▄▄ ▀█ ▄▀▄▀  ██  █ ▀▀ ▀ ▄█▀ ████
████▀█▀▀██▄███▄   █ ▄ ▄█    ▄ █ ▄ ▀  ▄▄▄ ▄█▄▄▄██ ▄▄▀  ▄▄█▄▀  ████
██████▄▄ ▀▄▀ █▀ ▄▄  ▄▀▄█▀▀▀ ▄ ▀ ▄▄ █▄▀██ ▀▀▀  █▄▄▄ █▀  ██▄█ █████
█████▄ █▀ ▄▀ █ ▀▀████▄  █▄▄▄█▀ █▄ ▄█▄ ▄   ▄ ▄██  █▄▀▀ ▀█▄ ▄▀▄████
██████ ▀▄▀▄▀ ▄▄  ▄▄█▄█▄   ▀███  ▄  █▄  ▀  ▀ ▄ ▄▄ ▄ █▄ ▄▀▄██  ████
████▀▄▀▀██▄▀▀▄ ▀▄ ████▄▄█ █ █ ▄█▄▀█ ▄█▄▄ ▀▄▄▄ ▄▀▄████▀ ▄█▀▀█▀████
████ ▀ ▀▀▄▄█ ▀ ███  ▀█▄▄██ ▄▄▀▀███ ▀██▀█ ▄██  █▀▀▀▄█▀  ▀▄█▄█ ████
██████████▄█ █▀ ▄█ █▄█ █▄ ▄█▄  ▄▄▄   ▀▄▀ ██  ▄█▄ ███ ▄▄▄   ▀ ████
████ ▄▄▄▄▄ █ ███▄▄▀▀▄▄██▄█▀▀   █▄█ ▀ ▄▀▀▀▄ ▀▄▄█ ▀▀█▀ █▄█  ▄▄▄████
████ █   █ █▄▄ █ █▀█  ▄ ▄  █ ▄ ▄ ▄ ▄▄██▄▄▀█▄ ▀█ ▄█▄▄ ▄    ▀▀█████
████ █▄▄▄█ █ █▀▀▀█ █▀▀█ ▄█▄█▀▄▄ ▄█▀▀██ █  ██  ▀▀███▄ ▄█▄▄▄▄▀▄████
████▄▄▄▄▄▄▄█▄▄▄▄▄▄▄▄█▄▄▄▄▄▄█▄▄▄███▄▄████▄▄██▄██▄▄█████▄█▄██▄▄████
█████████████████████████████████████████████████████████████████
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀`

const noQRCodeLogs = `2025-09-19T09:39:56+02:00 Starting WhatsApp bridge...
2025-09-19T09:39:56+02:00 Connecting to WhatsApp...
2025-09-19T09:39:56+02:00 Connected to WhatsApp`

const timeoutLogs = `2025-09-19T09:39:56+02:00 ████████
2025-09-19T09:39:56+02:00 ████████
2025-09-19T09:39:56+02:00 ████████
2025-09-19T09:40:16+02:00 Timeout waiting for QR code scan`;


const { mockBroadcast } = vi.hoisted(() => ({
  mockBroadcast: vi.fn(),
}));

vi.mock('@backend/websocket', () => ({
  default: {
    broadcast: mockBroadcast,
  },
}));

describe('whatsAppLogMonitor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('broadcasts QR code from logs', async () => {
    const { default: WebSocketService } = await import('@backend/websocket');
    const mockGetLogs = vi.fn().mockResolvedValue(logsWithQRCode);
    whatsAppLogMonitor(mockGetLogs, new Date('2025-09-19T09:39:55+02:00'));

    await vi.waitFor(() => {
      expect(WebSocketService.broadcast).toHaveBeenCalledWith({
        type: 'mcp-setup',
        payload: {
          provider: 'whatsapp',
          type: 'qrcode',
          status: 'detected',
          content: qrCode
        },
      });
    });
  });

  it('broadcasts latest QR code', async () => {
    const { default: WebSocketService } = await import('@backend/websocket');
    const mockGetLogs = vi.fn().mockResolvedValue(logsWith2QRCodes);
    whatsAppLogMonitor(mockGetLogs, new Date('2025-09-19T09:39:55+02:00'));

    await vi.waitFor(() => {
      expect(WebSocketService.broadcast).toHaveBeenCalledWith({
        type: 'mcp-setup',
        payload: expect.objectContaining({content: lastQRCode}),
      });
    });
  });

  it('makes multiple attempts', async () => {
    vi.useFakeTimers();

    const mockGetLogs = vi.fn()
      .mockResolvedValueOnce(noQRCodeLogs)
      .mockResolvedValue(logsWithQRCode);
    whatsAppLogMonitor(mockGetLogs, new Date('2025-09-19T09:39:55+02:00'));

    await vi.advanceTimersByTimeAsync(1000);
    await vi.waitFor(() => {
      expect(mockBroadcast).toHaveBeenCalled();
    });

    vi.useRealTimers();
  });

  it('does not broadcast if no QR code', async () => {
    vi.useFakeTimers();
    const { default: WebSocketService } = await import('@backend/websocket');
    const mockGetLogs = vi.fn().mockResolvedValue(noQRCodeLogs);
    whatsAppLogMonitor(mockGetLogs, new Date('2025-09-19T09:39:55+02:00'));

    await vi.advanceTimersByTimeAsync(1000);
    await vi.waitFor(() => {
      expect(mockGetLogs).toHaveBeenCalledTimes(2);
    });

    expect(WebSocketService.broadcast).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('broadcasts QR code event then pair success event', async () => {
    const { default: WebSocketService } = await import('@backend/websocket');
    const mockGetLogs = vi.fn()
      .mockResolvedValueOnce(logsWithQRCode) // First call finds QR code
      .mockResolvedValue(pairedAfterCode);   // Subsequent calls find "Successfully paired"

    whatsAppLogMonitor(mockGetLogs, new Date('2025-09-19T09:39:55+02:00'));

    await vi.waitFor(() => {
      expect(WebSocketService.broadcast).toHaveBeenCalledWith({
        type: 'mcp-setup',
        payload: expect.objectContaining({status: 'detected'}),
      });
    });

    await vi.waitFor(() => {
      expect(WebSocketService.broadcast).toHaveBeenCalledWith({
        type: 'mcp-setup',
        payload: expect.objectContaining({status: 'verified'}),
      });
    });

    expect(WebSocketService.broadcast).toHaveBeenCalledTimes(2);
  })

  it('ignores success messages coming before QR code', async () => {
    const { default: WebSocketService } = await import('@backend/websocket');
    const mockGetLogs = vi.fn().mockResolvedValue(pairedBeforeCode);

    // Use a date after the "Successfully paired" message but before the QR code
    const startAt = new Date('2025-09-18T00:00:00+02:00');
    whatsAppLogMonitor(mockGetLogs, startAt);

    await vi.waitFor(() => {
      expect(WebSocketService.broadcast).toHaveBeenCalledWith({
        type: 'mcp-setup',
        payload: expect.objectContaining({status: 'detected'}),
      });
    });

    expect(WebSocketService.broadcast).toHaveBeenCalledTimes(1);
  })

  it('broadcasts timeout event', async () => {
    const { default: WebSocketService } = await import('@backend/websocket');

    const mockGetLogs = vi.fn()
      .mockResolvedValueOnce(logsWithQRCode)
      .mockResolvedValue(timeoutLogs);

    whatsAppLogMonitor(mockGetLogs, new Date('2025-09-19T09:39:55+02:00'));

    await vi.waitFor(() => {
      expect(WebSocketService.broadcast).toHaveBeenCalledWith({
        type: 'mcp-setup',
        payload: expect.objectContaining({status: 'detected'}),
      });
    });

    await vi.waitFor(() => {
      expect(WebSocketService.broadcast).toHaveBeenCalledWith({
        type: 'mcp-setup',
        payload: expect.objectContaining({status: 'timeout'}),
      });
    });

    expect(WebSocketService.broadcast).toHaveBeenCalledTimes(2);
  })

  it.todo('stops polling after timeout')
});
