import type { JSX } from "solid-js";
import { InteractionDetailContent } from "@/components/logs/InteractionDetailContent";
import { Drawer, DrawerContent } from "@/components/primitives/Drawer";

export function InteractionDrawer(props: {
    interactionId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}): JSX.Element {
    return (
        <Drawer open={props.open} onOpenChange={props.onOpenChange}>
            <DrawerContent title="Interaction" size="full">
                {props.interactionId && <InteractionDetailContent interactionId={props.interactionId} />}
            </DrawerContent>
        </Drawer>
    );
}
