/**
 * MCP server setup wizard.
 * Currently there is only one setup provider: WhatsApp.
 */

import React from 'react';
import {Dialog, DialogContent} from "@ui/components/ui/dialog";
import WhatsAppSetup from "@ui/components/ConnectorCatalog/McpServerSetup/WhatsAppSetup";

export default function McpServerSetup({ open, onOpenChange, provider, content }: { open: boolean, onOpenChange: (open: boolean) => void, content: string, provider: string }) {
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
    {(() => {
      switch (provider) {
        case 'whatsapp':
          return <WhatsAppSetup content={content} />;
        default:
          return null;
      }
    })()}
    </DialogContent>
  </Dialog>
}
