/** WhatsApp setup wizard, which shows a QR code and waits for it to be scanned */

import React from 'react';
import {Dialog, DialogContent} from "@radix-ui/react-dialog";
import {DialogHeader, DialogTitle} from "@ui/components/ui/dialog";

export default function WhatsAppSetup() {
  // FIXME Subscribe to websocket mcp-setup events

  return <Dialog open={true}>
    <DialogContent className="max-w-3xl max-h-[80vh]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          Scan QR Code
        </DialogTitle>
        <ASCIIRenderer ascii={''}/>
      </DialogHeader>
    </DialogContent>
  </Dialog>
}

/** Renders QR Code from ASCII symbols */
function ASCIIRenderer({ascii}: { ascii: string }) {
  return <div className="block w-8 h-8 bg-white text-black whitespace-pre">{ascii}</div>
}
