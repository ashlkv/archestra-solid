/** WhatsApp setup wizard, which shows a QR code and waits for it to be scanned */

import React from 'react';
import { DialogTitle, DialogDescription } from "@ui/components/ui/dialog";

/**
 * Converts ASCII QR code to SVG React component
 * @param asciiQr - The ASCII QR code string
 * @param cellSize - Size of each QR code cell in pixels (default: 4)
 * @returns React SVG component
 */
function convertAsciiQrToSvg(asciiQr: string, cellSize: number = 4): React.ReactElement | null {
  const lines = asciiQr.trim().split('\n');
  if (lines.length === 0) return null;

  const width = lines[0].length;
  const height = lines.length;
  const svgWidth = width * cellSize / 2;
  const svgHeight = height * cellSize;

  const rects: React.ReactElement[] = [];

  for (let y = 0; y < height; y++) {
    const line = lines[y];
    for (let x = 0; x < line.length; x++) {
      const char = line[x];
      const rectX = x * cellSize / 2;
      const rectY = y * cellSize;

      // Handle different ASCII QR code characters
      switch (char) {
        case '█': // Full block - black square
          rects.push(
            <rect
              key={`${x}-${y}`}
              x={rectX}
              y={rectY}
              width={cellSize / 2}
              height={cellSize}
              fill="black"
            />
          );
          break;
        case '▄': // Lower half block - black bottom half
          rects.push(
            <rect
              key={`${x}-${y}`}
              x={rectX}
              y={rectY + cellSize/2}
              width={cellSize / 2}
              height={cellSize/2}
              fill="black"
            />
          );
          break;
        case '▀': // Upper half block - black top half
          rects.push(
            <rect
              key={`${x}-${y}`}
              x={rectX}
              y={rectY}
              width={cellSize / 2}
              height={cellSize/2}
              fill="black"
            />
          );
          break;
        case ' ': // Space - white square (already white background)
          break;
        default:
          // For any other characters, treat as black for safety
          rects.push(
            <rect
              key={`${x}-${y}`}
              x={rectX}
              y={rectY}
              width={cellSize / 2}
              height={cellSize}
              fill="black"
            />
          );
          break;
      }
    }
  }

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      className="max-w-full max-h-96"
    >
      <rect width={svgWidth} height={svgHeight} fill="white"/>
      {rects}
    </svg>
  );
}

/** Renders WhatsApp QR Code from ASCII symbols */
export default function WhatsAppSetup({ content: ascii }: { content: string }) {
  const SvgQrCode = ascii ? convertAsciiQrToSvg(ascii, 10) : '';

  return <>
    <DialogTitle className="flex items-center gap-2">
      Connect WhatsApp
    </DialogTitle>
    <DialogDescription>
      Scan this QR code with your phone to connect your WhatsApp account to Archestra.
    </DialogDescription>

    <div className="flex justify-center p-4 rounded-md">
      {SvgQrCode}
    </div>

    <div className="text-sm text-muted-foreground text-center">
      <p>Open WhatsApp → Settings → Linked Devices → Tap "Link device", then scan this code.</p>
      <p className="text-xs mt-2 opacity-75">QR code expires after a few minutes for security.</p>
    </div>
  </>
}

