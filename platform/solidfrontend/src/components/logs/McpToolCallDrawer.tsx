import type { JSX } from "solid-js";
import { McpToolCallDetailContent } from "@/components/logs/McpToolCallDetailContent";
import { Drawer, DrawerContent } from "@/components/primitives/Drawer";

export function McpToolCallDrawer(props: {
    mcpToolCallId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}): JSX.Element {
    return (
        <Drawer open={props.open} onOpenChange={props.onOpenChange}>
            <DrawerContent title="MCP Tool Call" size="full">
                {props.mcpToolCallId && <McpToolCallDetailContent mcpToolCallId={props.mcpToolCallId} />}
            </DrawerContent>
        </Drawer>
    );
}
