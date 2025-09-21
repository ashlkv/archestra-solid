/** WhatsApp setup wizard, which shows a QR code and waits for it to be scanned */

import React from 'react';
import { DialogTitle } from "@ui/components/ui/dialog";

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
  const svgWidth = width * cellSize;
  const svgHeight = height * cellSize;

  const rects: React.ReactElement[] = [];

  for (let y = 0; y < height; y++) {
    const line = lines[y];
    for (let x = 0; x < line.length; x++) {
      const char = line[x];
      const rectX = x * cellSize;
      const rectY = y * cellSize;

      // Handle different ASCII QR code characters
      switch (char) {
        case '█': // Full block - black square
          rects.push(
            <rect
              key={`${x}-${y}`}
              x={rectX}
              y={rectY}
              width={cellSize}
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
              width={cellSize}
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
              width={cellSize}
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
              width={cellSize}
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
  const SvgQrCode = ascii ? convertAsciiQrToSvg(ascii, 3) : '';

  return <>
    <DialogTitle className="flex items-center gap-2">
      {/* FIXME Update the dialog title, description, etc. */}
      Scan the QR Code
    </DialogTitle>
    <div className="flex justify-center p-4 bg-white rounded-md">
      {SvgQrCode}
    </div>
  </>
}

