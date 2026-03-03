import { For, type JSX } from "solid-js";
import { Badge } from "@/components/primitives/Badge";
import { UiLayout } from "@/components/ui-demo/UiLayout";

const VARIANTS = [
    "default",
    "ghost",
    "outline",
    "muted",
    "primary",
    "secondary",
    "accent",
    "info",
    "success",
    "warning",
    "destructive",
] as const;

export default function BadgeDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="BadgeDemo">
                <h2>Badge</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Small inline label for status, categories, or counts. Supports multiple color variants, caps, and pill shapes.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="All variants">
                        <h3>Variants</h3>
                        <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem", "margin-top": "0.5rem" }}>
                            <For each={VARIANTS}>
                                {(variant) => <Badge variant={variant}>{variant}</Badge>}
                            </For>
                        </div>
                    </section>

                    <section data-label="Caps">
                        <h3>Caps</h3>
                        <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem", "margin-top": "0.5rem" }}>
                            <Badge caps>Default caps</Badge>
                            <Badge variant="info" caps>Info caps</Badge>
                            <Badge variant="success" caps>Success caps</Badge>
                            <Badge variant="warning" caps>Warning caps</Badge>
                        </div>
                    </section>

                    <section data-label="Pill">
                        <h3>Pill</h3>
                        <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem", "margin-top": "0.5rem" }}>
                            <Badge pill>Default pill</Badge>
                            <Badge variant="primary" pill>Primary pill</Badge>
                            <Badge variant="accent" pill>Accent pill</Badge>
                            <Badge variant="destructive" pill>Destructive pill</Badge>
                        </div>
                    </section>

                    <section data-label="Combined">
                        <h3>Caps + pill combined</h3>
                        <div style={{ display: "flex", "flex-wrap": "wrap", gap: "0.5rem", "margin-top": "0.5rem" }}>
                            <Badge caps pill>Default</Badge>
                            <Badge variant="success" caps pill>Active</Badge>
                            <Badge variant="destructive" caps pill>Deleted</Badge>
                            <Badge variant="warning" caps pill>Pending</Badge>
                        </div>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
