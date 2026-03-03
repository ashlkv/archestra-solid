import { createSignal, For, type JSX } from "solid-js";
import { UiLayout } from "@/components/ui-demo/UiLayout";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
} from "@/components/primitives/Table";

const SAMPLE_DATA = [
    { id: "1", name: "fetch-weather", server: "weather-api", status: "Active", calls: 1432 },
    { id: "2", name: "query-database", server: "postgres-mcp", status: "Active", calls: 892 },
    { id: "3", name: "send-email", server: "email-service", status: "Disabled", calls: 56 },
    { id: "4", name: "read-file", server: "filesystem", status: "Active", calls: 3201 },
    { id: "5", name: "search-web", server: "brave-search", status: "Active", calls: 764 },
];

export default function TableDemo(): JSX.Element {
    const [selectedId, setSelectedId] = createSignal<string | undefined>(undefined);

    return (
        <UiLayout>
            <div style={{ padding: "2rem", "max-width": "900px", margin: "0 auto" }} data-label="TableDemo">
                <h2>Table</h2>
                <p style={{ color: "var(--muted-foreground)", "margin-bottom": "2rem" }}>
                    Composable table primitives: Table, TableHead, TableBody, TableRow, TableHeaderCell, and TableCell.
                </p>

                <section data-label="Basic table">
                    <h3>Basic table</h3>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>Name</TableHeaderCell>
                                <TableHeaderCell>Server</TableHeaderCell>
                                <TableHeaderCell>Status</TableHeaderCell>
                                <TableHeaderCell>Calls</TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <For each={SAMPLE_DATA}>
                                {(row) => (
                                    <TableRow data-label={`Row: ${row.name}`}>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.server}</TableCell>
                                        <TableCell>{row.status}</TableCell>
                                        <TableCell>{row.calls}</TableCell>
                                    </TableRow>
                                )}
                            </For>
                        </TableBody>
                    </Table>
                </section>

                <section style={{ "margin-top": "2rem" }} data-label="Clickable rows">
                    <h3>Clickable rows</h3>
                    <p style={{ color: "var(--muted-foreground)", "margin-bottom": "0.5rem" }}>
                        Rows with an onClick handler get a hover style. The <code>current</code> prop highlights the
                        selected row.
                    </p>
                    <p style={{ "margin-bottom": "0.5rem" }}>
                        Selected: <strong>{selectedId() ?? "none"}</strong>
                    </p>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>Name</TableHeaderCell>
                                <TableHeaderCell>Server</TableHeaderCell>
                                <TableHeaderCell>Status</TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <For each={SAMPLE_DATA}>
                                {(row) => (
                                    <TableRow
                                        current={selectedId() === row.id}
                                        onClick={() => setSelectedId(row.id)}
                                        data-label={`Clickable row: ${row.name}`}
                                    >
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.server}</TableCell>
                                        <TableCell>{row.status}</TableCell>
                                    </TableRow>
                                )}
                            </For>
                        </TableBody>
                    </Table>
                </section>
            </div>
        </UiLayout>
    );
}
