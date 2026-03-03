import { createSignal, type JSX } from "solid-js";
import { UiLayout } from "@/components/ui-demo/UiLayout";
import { ToggleGroup, ToggleButton } from "@/components/primitives/ToggleGroup";
import { Eye, EyeOff, Layers, Globe, Terminal } from "@/components/icons";

export default function ToggleGroupDemo(): JSX.Element {
    const [viewMode, setViewMode] = createSignal<"list" | "grid">("list");
    const [transport, setTransport] = createSignal<"stdio" | "http">("stdio");
    const [visibility, setVisibility] = createSignal(true);
    const [mediumSelection, setMediumSelection] = createSignal<"a" | "b" | "c">("a");

    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="ToggleGroupDemo">
                <h2>ToggleGroup</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    A group of toggle buttons where one or more can be selected. Built on the Button primitive with
                    ghost variant. Supports icon-only and labeled buttons.
                </p>

                <section data-label="Icon-only toggles">
                    <h3>Icon-only toggles</h3>
                    <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.5rem" }}>
                        Visibility: <strong>{visibility() ? "visible" : "hidden"}</strong>
                    </p>
                    <ToggleGroup>
                        <ToggleButton
                            selected={visibility()}
                            tooltip="Show"
                            size="small"
                            onClick={() => setVisibility(true)}
                            data-label="Show toggle"
                        >
                            <Eye size={16} />
                        </ToggleButton>
                        <ToggleButton
                            selected={!visibility()}
                            tooltip="Hide"
                            size="small"
                            onClick={() => setVisibility(false)}
                            data-label="Hide toggle"
                        >
                            <EyeOff size={16} />
                        </ToggleButton>
                    </ToggleGroup>
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="With labels">
                    <h3>With labels</h3>
                    <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.5rem" }}>
                        Transport: <strong>{transport()}</strong>
                    </p>
                    <ToggleGroup>
                        <ToggleButton
                            selected={transport() === "stdio"}
                            tooltip="Standard I/O transport"
                            label="stdio"
                            size="small"
                            onClick={() => setTransport("stdio")}
                            data-label="Stdio toggle"
                        >
                            <Terminal size={16} />
                        </ToggleButton>
                        <ToggleButton
                            selected={transport() === "http"}
                            tooltip="Streamable HTTP transport"
                            label="http"
                            size="small"
                            onClick={() => setTransport("http")}
                            data-label="HTTP toggle"
                        >
                            <Globe size={16} />
                        </ToggleButton>
                    </ToggleGroup>
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="Size small">
                    <h3>Size: small</h3>
                    <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.5rem" }}>
                        View: <strong>{viewMode()}</strong>
                    </p>
                    <ToggleGroup size="small">
                        <ToggleButton
                            selected={viewMode() === "list"}
                            tooltip="List view"
                            size="small"
                            onClick={() => setViewMode("list")}
                        >
                            <Layers size={14} />
                        </ToggleButton>
                        <ToggleButton
                            selected={viewMode() === "grid"}
                            tooltip="Grid view"
                            size="small"
                            onClick={() => setViewMode("grid")}
                        >
                            <Globe size={14} />
                        </ToggleButton>
                    </ToggleGroup>
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="Size medium">
                    <h3>Size: medium</h3>
                    <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.5rem" }}>
                        Selection: <strong>{mediumSelection()}</strong>
                    </p>
                    <ToggleGroup size="medium">
                        <ToggleButton
                            selected={mediumSelection() === "a"}
                            tooltip="Option A"
                            label="Option A"
                            size="medium"
                            onClick={() => setMediumSelection("a")}
                        >
                            <Layers size={16} />
                        </ToggleButton>
                        <ToggleButton
                            selected={mediumSelection() === "b"}
                            tooltip="Option B"
                            label="Option B"
                            size="medium"
                            onClick={() => setMediumSelection("b")}
                        >
                            <Globe size={16} />
                        </ToggleButton>
                        <ToggleButton
                            selected={mediumSelection() === "c"}
                            tooltip="Option C"
                            label="Option C"
                            size="medium"
                            onClick={() => setMediumSelection("c")}
                        >
                            <Terminal size={16} />
                        </ToggleButton>
                    </ToggleGroup>
                </section>
            </div>
        </UiLayout>
    );
}
