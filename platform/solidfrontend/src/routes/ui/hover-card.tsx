import type { JSX } from "solid-js";
import { Info, User } from "@/components/icons";
import { Button } from "@/components/primitives/Button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/primitives/HoverCard";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function HoverCardDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="HoverCardDemo">
                <h2>HoverCard</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    A card that appears on hover, built on Kobalte HoverCard. Supports configurable placement, open
                    delay, and close delay.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Default hover card">
                        <h3>Default (400ms open delay)</h3>
                        <HoverCard>
                            <HoverCardTrigger>
                                <span
                                    style={{
                                        "text-decoration": "underline",
                                        "text-decoration-style": "dotted",
                                        cursor: "pointer",
                                    }}
                                >
                                    Hover over me
                                </span>
                            </HoverCardTrigger>
                            <HoverCardContent>
                                <div style={{ display: "flex", "flex-direction": "column", gap: "0.5rem" }}>
                                    <strong>Default hover card</strong>
                                    <p>This card opens after a 400ms delay and closes after 100ms.</p>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    </section>

                    <section data-label="Quick open">
                        <h3>Quick open (100ms delay)</h3>
                        <HoverCard openDelay={100} closeDelay={50}>
                            <HoverCardTrigger>
                                <span style={{ display: "inline-flex", "align-items": "center", gap: "0.25rem" }}>
                                    <Info size={16} />
                                    Quick info
                                </span>
                            </HoverCardTrigger>
                            <HoverCardContent>
                                <p>This card appears quickly with only 100ms delay.</p>
                            </HoverCardContent>
                        </HoverCard>
                    </section>

                    <section data-label="Placements">
                        <h3>Placements</h3>
                        <div style={{ display: "flex", gap: "2rem", "flex-wrap": "wrap", "padding-top": "1rem" }}>
                            <HoverCard placement="top">
                                <HoverCardTrigger>
                                    <Button variant="outline" size="small">
                                        Top
                                    </Button>
                                </HoverCardTrigger>
                                <HoverCardContent>Placed on top</HoverCardContent>
                            </HoverCard>

                            <HoverCard placement="right">
                                <HoverCardTrigger>
                                    <Button variant="outline" size="small">
                                        Right
                                    </Button>
                                </HoverCardTrigger>
                                <HoverCardContent>Placed on right</HoverCardContent>
                            </HoverCard>

                            <HoverCard placement="bottom">
                                <HoverCardTrigger>
                                    <Button variant="outline" size="small">
                                        Bottom
                                    </Button>
                                </HoverCardTrigger>
                                <HoverCardContent>Placed on bottom</HoverCardContent>
                            </HoverCard>

                            <HoverCard placement="left">
                                <HoverCardTrigger>
                                    <Button variant="outline" size="small">
                                        Left
                                    </Button>
                                </HoverCardTrigger>
                                <HoverCardContent>Placed on left</HoverCardContent>
                            </HoverCard>
                        </div>
                    </section>

                    <section data-label="Rich content">
                        <h3>Rich content</h3>
                        <HoverCard openDelay={200}>
                            <HoverCardTrigger>
                                <span
                                    style={{
                                        display: "inline-flex",
                                        "align-items": "center",
                                        gap: "0.5rem",
                                        cursor: "pointer",
                                    }}
                                >
                                    <User size={16} />
                                    <span style={{ "text-decoration": "underline", "text-decoration-style": "dotted" }}>
                                        john.doe
                                    </span>
                                </span>
                            </HoverCardTrigger>
                            <HoverCardContent>
                                <div
                                    style={{
                                        display: "flex",
                                        "flex-direction": "column",
                                        gap: "0.5rem",
                                        "min-width": "200px",
                                    }}
                                >
                                    <div style={{ display: "flex", "align-items": "center", gap: "0.5rem" }}>
                                        <User size={24} />
                                        <div>
                                            <strong>John Doe</strong>
                                            <p style={{ color: "var(--muted-foreground)" }}>john.doe@example.com</p>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            "border-top": "1px solid var(--border)",
                                            "padding-top": "0.5rem",
                                            color: "var(--muted-foreground)",
                                        }}
                                    >
                                        Admin role - Joined March 2025
                                    </div>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
