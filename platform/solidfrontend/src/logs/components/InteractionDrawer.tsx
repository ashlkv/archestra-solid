import { createSignal, type JSX, Show } from "solid-js";
import { Code2, MessageCircle } from "@/icons";
import { InteractionDetailContent, InteractionHeaderBar } from "@/logs/components/InteractionDetailContent";
import { Drawer, DrawerContent } from "@/primitives/Drawer";
import { ToggleGroup, ToggleButton } from "@/primitives/ToggleGroup";

export function InteractionDrawer(props: {
    interactionId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}): JSX.Element {
    const [view, setView] = createSignal<"chat" | "raw">("chat", { name: "view" });

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
                    <ToggleButton
                        selected={view() === "chat"}
                        tooltip="Chat view"
                        label="Chat"
                        onClick={() => setView("chat")}
                    >
                        <MessageCircle style={{ width: "14px", height: "14px" }} />
                    </ToggleButton>
                    <ToggleButton
                        selected={view() === "raw"}
                        tooltip="Raw data"
                        label="Raw"
                        onClick={() => setView("raw")}
                    >
                        <Code2 style={{ width: "14px", height: "14px" }} />
                    </ToggleButton>
                </ToggleGroup>
            </div>
        ) as JSX.Element;
    };

    return (
        <Drawer open={props.open} onOpenChange={props.onOpenChange}>
            <DrawerContent
                title="Log entry"
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
