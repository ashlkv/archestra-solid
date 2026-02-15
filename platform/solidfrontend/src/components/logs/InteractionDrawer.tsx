import { createSignal, type JSX, Show } from "solid-js";
import { Code2, MessageCircle } from "@/components/icons";
import { InteractionDetailContent, InteractionHeaderBar } from "@/components/logs/InteractionDetailContent";
import { Drawer, DrawerContent } from "@/components/primitives/Drawer";
import { ToggleGroup, ToggleItem } from "@/components/primitives/ToggleGroup";

export function InteractionDrawer(props: {
    interactionId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}): JSX.Element {
    const [view, setView] = createSignal<"chat" | "raw">("chat");

    const headerContent = () => {
        if (!props.interactionId) return undefined;
        return (
            <div
                style={{
                    display: "flex",
                    "align-items": "center",
                    gap: "0.5rem",
                    padding: "0 1rem",
                }}
            >
                <div style={{ flex: "1", "min-width": "0" }}>
                    <InteractionHeaderBar interactionId={props.interactionId!} />
                </div>
                <ToggleGroup size="xsmall">
                    <ToggleItem selected={view() === "chat"} tooltip="Chat view" onClick={() => setView("chat")}>
                        <MessageCircle style={{ width: "14px", height: "14px" }} />
                    </ToggleItem>
                    <ToggleItem selected={view() === "raw"} tooltip="Raw data" onClick={() => setView("raw")}>
                        <Code2 style={{ width: "14px", height: "14px" }} />
                    </ToggleItem>
                </ToggleGroup>
            </div>
        ) as JSX.Element;
    };

    return (
        <Drawer open={props.open} onOpenChange={props.onOpenChange}>
            <DrawerContent
                title="Interaction"
                description={props.interactionId ?? undefined}
                size="full"
                headerContent={headerContent()}
            >
                <Show when={props.interactionId}>
                    <InteractionDetailContent interactionId={props.interactionId!} view={view()} />
                </Show>
            </DrawerContent>
        </Drawer>
    );
}
