/** WhatsApp setup wizard, which shows a QR code and waits for it to be scanned */

import React from 'react';
import { DialogTitle } from "@ui/components/ui/dialog";

/** Renders WhatsApp QR Code from ASCII symbols */
export default function WhatsAppSetup({ content: acsii }: { content: string }) {
  return <>
    <DialogTitle className="flex items-center gap-2">
      {/* FIXME Update the dialog title, description, etc. */}
      Scan the QR Code
    </DialogTitle>
    <div className="block w-120 h-120 bg-white text-black whitespace-pre font-mono text-xs leading-3">{acsii}</div>
  </>
}

