import { describe, it, expect, vi, beforeEach } from 'vitest';
import { whatsappQrCodeMonitor } from './whatsapp-qr-code-monitor';

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

const qrCodeWithTimeout = `2025-09-21T21:20:37+02:00 Scan this QR code with your WhatsApp app:
2025-09-21T21:20:37+02:00 █████████
2025-09-21T21:20:37+02:00 █████████
2025-09-21T21:20:37+02:00 ████ ▄▄▄▄
2025-09-21T21:20:37+02:00 ▀▀▀▀▀▀▀▀▀
2025-09-21T21:23:57+02:00 19:23:57.552 [Client ERROR] Timeout waiting for QR code scan`

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

vi.mock('@backend/utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('whatsAppLogMonitor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('broadcasts QR code from logs', async () => {
    const { default: WebSocketService } = await import('@backend/websocket');
    const mockGetLogs = vi.fn().mockResolvedValue(logsWithQRCode);
    whatsappQrCodeMonitor('s1', mockGetLogs, { startAt: new Date('2025-09-19T09:39:55+02:00') });

    await vi.waitFor(() => {
      expect(WebSocketService.broadcast).toHaveBeenCalledWith({
        type: 'mcp-setup',
        payload: {
          serverId: 's1',
          provider: 'whatsapp',
          status: 'pending',
          content: qrCode
        },
      });
    });
  });

  it('broadcasts latest QR code', async () => {
    const { default: WebSocketService } = await import('@backend/websocket');
    const mockGetLogs = vi.fn().mockResolvedValue(logsWith2QRCodes);
    whatsappQrCodeMonitor('s1', mockGetLogs, { startAt: new Date('2025-09-19T09:39:55+02:00') });

    await vi.waitFor(() => {
      expect(WebSocketService.broadcast).toHaveBeenCalledWith({
        type: 'mcp-setup',
        payload: expect.objectContaining({
          serverId: 's1',
          provider: 'whatsapp',
          status: 'pending',
          content: lastQRCode
        }),
      });
    });
  });

  it('makes multiple attempts', async () => {
    vi.useFakeTimers();

    const mockGetLogs = vi.fn()
      .mockResolvedValueOnce(noQRCodeLogs)
      .mockResolvedValue(logsWithQRCode);
    whatsappQrCodeMonitor('s1', mockGetLogs, { startAt: new Date('2025-09-19T09:39:55+02:00') });

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
    whatsappQrCodeMonitor('s1', mockGetLogs, { startAt: new Date('2025-09-19T09:39:55+02:00') });

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

    whatsappQrCodeMonitor('s1', mockGetLogs, { startAt: new Date('2025-09-19T09:39:55+02:00') });

    await vi.waitFor(() => {
      expect(WebSocketService.broadcast).toHaveBeenCalledWith({
        type: 'mcp-setup',
        payload: expect.objectContaining({
          serverId: 's1',
          provider: 'whatsapp',
          status: 'pending'
        }),
      });
    });

    await vi.waitFor(() => {
      expect(WebSocketService.broadcast).toHaveBeenCalledWith({
        type: 'mcp-setup',
        payload: expect.objectContaining({
          serverId: 's1',
          provider: 'whatsapp',
          status: 'success'
        }),
      });
    });

    expect(WebSocketService.broadcast).toHaveBeenCalledTimes(2);
  })

  it('ignores success messages coming before QR code', async () => {
    const { default: WebSocketService } = await import('@backend/websocket');
    const mockGetLogs = vi.fn().mockResolvedValue(pairedBeforeCode);

    // Use a date after the "Successfully paired" message but before the QR code
    const startAt = new Date('2025-09-18T00:00:00+02:00');
    whatsappQrCodeMonitor('s1', mockGetLogs, { startAt });

    await vi.waitFor(() => {
      expect(WebSocketService.broadcast).toHaveBeenCalledWith({
        type: 'mcp-setup',
        payload: expect.objectContaining({
          serverId: 's1',
          provider: 'whatsapp',
          status: 'pending'
        }),
      });
    });

    expect(WebSocketService.broadcast).toHaveBeenCalledTimes(1);
  })

  it('broadcasts timeout event', async () => {
    const { default: WebSocketService } = await import('@backend/websocket');

    const mockGetLogs = vi.fn()
      .mockResolvedValueOnce(logsWithQRCode)
      .mockResolvedValue(timeoutLogs);

    whatsappQrCodeMonitor('s1', mockGetLogs, { startAt: new Date('2025-09-19T09:39:55+02:00') });

    await vi.waitFor(() => {
      expect(WebSocketService.broadcast).toHaveBeenCalledWith({
        type: 'mcp-setup',
        payload: expect.objectContaining({
          serverId: 's1',
          provider: 'whatsapp',
          status: 'pending'
        }),
      });
    });

    await vi.waitFor(() => {
      expect(WebSocketService.broadcast).toHaveBeenCalledWith({
        type: 'mcp-setup',
        payload: expect.objectContaining({
          serverId: 's1',
          provider: 'whatsapp',
          status: 'error'
        }),
      });
    });

    expect(WebSocketService.broadcast).toHaveBeenCalledTimes(2);
  })

  it('returns nothing if cutoff', async () => {
    vi.useFakeTimers();
    const { default: WebSocketService } = await import('@backend/websocket');
    const mockGetLogs = vi.fn().mockResolvedValue(qrCodeWithTimeout);
    whatsappQrCodeMonitor('s1', mockGetLogs, { startAt: new Date('2025-09-21T21:20:40+02:00') });
    await vi.advanceTimersByTimeAsync(1000);
    await vi.waitFor(() => {
      expect(mockGetLogs).toHaveBeenCalledTimes(2);
    });

    expect(WebSocketService.broadcast).not.toHaveBeenCalled();
    vi.useRealTimers();
  })
  it('stops polling after timeout', async () => {
    vi.useFakeTimers();
    const { default: WebSocketService } = await import('@backend/websocket');

    const mockGetLogs = vi.fn()
      .mockResolvedValueOnce(logsWithQRCode) // First call finds initial QR code
      .mockResolvedValue(timeoutLogs); // All subsequent calls show timeout

    whatsappQrCodeMonitor('s1', mockGetLogs, { startAt: new Date('2025-09-19T09:39:55+02:00') });

    // Wait for initial QR code broadcast
    await vi.waitFor(() => {
      expect(WebSocketService.broadcast).toHaveBeenCalledWith({
        type: 'mcp-setup',
        payload: expect.objectContaining({
          serverId: 's1',
          provider: 'whatsapp',
          status: 'pending'
        }),
      });
    });

    // Wait for timeout broadcast
    await vi.waitFor(() => {
      expect(WebSocketService.broadcast).toHaveBeenCalledWith({
        type: 'mcp-setup',
        payload: expect.objectContaining({
          serverId: 's1',
          provider: 'whatsapp',
          status: 'error'
        }),
      });
    });

    // Should have exactly 2 broadcasts: initial QR code + timeout
    expect(WebSocketService.broadcast).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  })

  it('continues polling for qr code updates', async () => {
    const { default: WebSocketService } = await import('@backend/websocket');

    const initialLogs = `2025-09-19T09:39:56+02:00 Scan this QR code with your WhatsApp app:
2025-09-19T09:39:56+02:00 ████████
2025-09-19T09:39:56+02:00 ████████
2025-09-19T09:39:56+02:00 ████████`;

    const updatedLogs = `2025-09-19T09:39:56+02:00 Scan this QR code with your WhatsApp app:
2025-09-19T09:39:56+02:00 ████████
2025-09-19T09:39:56+02:00 ████████
2025-09-19T09:39:56+02:00 ████████
2025-09-19T09:40:00+02:00 Scan this QR code with your WhatsApp app:
2025-09-19T09:40:00+02:00 ████████
2025-09-19T09:40:00+02:00 █ ▄▄▄▄ █
2025-09-19T09:40:00+02:00 ████████`;

    let callCount = 0;
    const mockGetLogs = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.resolve(initialLogs);
      } else {
        return Promise.resolve(updatedLogs);
      }
    });

    whatsappQrCodeMonitor('s1', mockGetLogs, { startAt: new Date('2025-09-19T09:39:55+02:00') });

    // Wait for both QR codes to be broadcast (initial + update)
    await vi.waitFor(() => {
      expect(WebSocketService.broadcast).toHaveBeenCalledTimes(2);
    }, { timeout: 3000 });

    // Verify polling happened to find updates
    expect(mockGetLogs).toHaveBeenCalled();
  })
});
