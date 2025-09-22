/**
 * MCP server setup wizard.
 * Currently there is only one setup provider: WhatsApp.
 */
import React from 'react';

import WhatsAppSetup from '@ui/components/ConnectorCatalog/McpServerSetup/WhatsAppSetup';
import { Dialog, DialogContent } from '@ui/components/ui/dialog';

export default function McpServerSetup({
  open,
  onOpenChange,
  provider,
  content,
  status,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  provider: string;
  status?: string;
}) {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        {(() => {
          switch (provider) {
            case 'whatsapp':
              return <WhatsAppSetup content={content} status={status} onClose={handleClose} />;
            default:
              return null;
          }
        })()}
      </DialogContent>
    </Dialog>
  );
}
