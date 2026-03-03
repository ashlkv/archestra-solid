import type { JSX } from "solid-js";
import { Ellipsis, Pencil, Copy, Trash2, ExternalLink, Settings } from "@/components/icons";
import { Button } from "@/components/primitives/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/primitives/DropdownMenu";
import { UiLayout } from "@/components/ui-demo/UiLayout";

export default function DropdownMenuDemo(): JSX.Element {
    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="DropdownMenuDemo">
                <h2>DropdownMenu</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    A menu that appears on trigger click, built on Kobalte DropdownMenu.
                </p>

                <div style={{ display: "flex", "flex-direction": "column", gap: "2rem" }}>
                    <section data-label="Basic dropdown">
                        <h3>Basic dropdown</h3>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant="outline">Open menu</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => alert("Edit clicked")}>
                                    <Pencil size={14} />
                                    <span style={{ "margin-left": "0.5rem" }}>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => alert("Copy clicked")}>
                                    <Copy size={14} />
                                    <span style={{ "margin-left": "0.5rem" }}>Copy</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => alert("Settings clicked")}>
                                    <Settings size={14} />
                                    <span style={{ "margin-left": "0.5rem" }}>Settings</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </section>

                    <section data-label="With separator and destructive item">
                        <h3>With separator and destructive item</h3>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant="outline" size="icon">
                                    <Ellipsis size={16} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>
                                    <Pencil size={14} />
                                    <span style={{ "margin-left": "0.5rem" }}>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <ExternalLink size={14} />
                                    <span style={{ "margin-left": "0.5rem" }}>Open in new tab</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem variant="destructive">
                                    <Trash2 size={14} />
                                    <span style={{ "margin-left": "0.5rem" }}>Delete</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </section>

                    <section data-label="With disabled items">
                        <h3>With disabled items</h3>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant="secondary">Actions</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Enabled action</DropdownMenuItem>
                                <DropdownMenuItem disabled>Disabled action</DropdownMenuItem>
                                <DropdownMenuItem>Another enabled action</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem variant="destructive" disabled>
                                    Disabled destructive
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </section>
                </div>
            </div>
        </UiLayout>
    );
}
