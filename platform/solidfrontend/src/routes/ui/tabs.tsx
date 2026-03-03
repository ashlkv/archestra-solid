import { createSignal, type JSX } from "solid-js";
import { UiLayout } from "@/components/ui-demo/UiLayout";
import { Tabs, TabList, Tab, TabContent } from "@/components/primitives/Tabs";

export default function TabsDemo(): JSX.Element {
    const [controlledTab, setControlledTab] = createSignal("overview");

    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="TabsDemo">
                <h2>Tabs</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Tab navigation built on Kobalte. Supports vertical (default) and horizontal orientation, controlled
                    and uncontrolled modes, and disabled tabs.
                </p>

                <section data-label="Default vertical tabs">
                    <h3>Default (vertical orientation)</h3>
                    <Tabs defaultValue="general">
                        <TabList>
                            <Tab value="general">General</Tab>
                            <Tab value="security">Security</Tab>
                            <Tab value="notifications">Notifications</Tab>
                        </TabList>
                        <TabContent value="general">
                            <div style={{ padding: "1rem" }}>General settings content goes here.</div>
                        </TabContent>
                        <TabContent value="security">
                            <div style={{ padding: "1rem" }}>Security settings content goes here.</div>
                        </TabContent>
                        <TabContent value="notifications">
                            <div style={{ padding: "1rem" }}>Notification preferences content goes here.</div>
                        </TabContent>
                    </Tabs>
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="Horizontal tabs">
                    <h3>Horizontal orientation</h3>
                    <Tabs defaultValue="logs" orientation="horizontal">
                        <TabList>
                            <Tab value="logs">Logs</Tab>
                            <Tab value="metrics">Metrics</Tab>
                            <Tab value="traces">Traces</Tab>
                        </TabList>
                        <TabContent value="logs">
                            <div style={{ padding: "1rem" }}>Application logs will appear here.</div>
                        </TabContent>
                        <TabContent value="metrics">
                            <div style={{ padding: "1rem" }}>Prometheus metrics dashboard.</div>
                        </TabContent>
                        <TabContent value="traces">
                            <div style={{ padding: "1rem" }}>Distributed traces from Tempo.</div>
                        </TabContent>
                    </Tabs>
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="Controlled tabs">
                    <h3>Controlled</h3>
                    <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.5rem" }}>
                        Current tab: <strong>{controlledTab()}</strong>
                    </p>
                    <Tabs value={controlledTab()} onChange={setControlledTab}>
                        <TabList>
                            <Tab value="overview">Overview</Tab>
                            <Tab value="tools">Tools</Tab>
                            <Tab value="policies">Policies</Tab>
                        </TabList>
                        <TabContent value="overview">
                            <div style={{ padding: "1rem" }}>Profile overview with key metrics.</div>
                        </TabContent>
                        <TabContent value="tools">
                            <div style={{ padding: "1rem" }}>Assigned MCP tools for this profile.</div>
                        </TabContent>
                        <TabContent value="policies">
                            <div style={{ padding: "1rem" }}>Tool invocation and trusted data policies.</div>
                        </TabContent>
                    </Tabs>
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="Disabled tab">
                    <h3>With disabled tab</h3>
                    <Tabs defaultValue="active">
                        <TabList>
                            <Tab value="active">Active</Tab>
                            <Tab value="disabled" disabled>
                                Disabled
                            </Tab>
                            <Tab value="another">Another</Tab>
                        </TabList>
                        <TabContent value="active">
                            <div style={{ padding: "1rem" }}>This tab is active and selectable.</div>
                        </TabContent>
                        <TabContent value="disabled">
                            <div style={{ padding: "1rem" }}>You should not be able to reach this.</div>
                        </TabContent>
                        <TabContent value="another">
                            <div style={{ padding: "1rem" }}>Another selectable tab.</div>
                        </TabContent>
                    </Tabs>
                </section>
            </div>
        </UiLayout>
    );
}
