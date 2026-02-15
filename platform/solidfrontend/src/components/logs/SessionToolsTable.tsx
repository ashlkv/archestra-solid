import { createSignal, For, type JSX } from "solid-js";
import { Pencil } from "@/components/icons";
import { Button } from "@/components/primitives/Button";
import { Table, TableBody, TableCell, TableRow } from "@/components/primitives/Table";
import { EditPolicyDialog } from "@/components/tools/EditPolicyDialog";
import { OriginBadge } from "@/components/tools/OriginBadge";
import { ToolName } from "@/components/tools/ToolName";
import styles from "./SessionToolsTable.module.css";

export function SessionToolsTable(props: { toolNames: string[] }): JSX.Element {
    const [editingTool, setEditingTool] = createSignal<string | null>(null);

    return (
        <div class={styles.root}>
            <span class={styles.caption}>Tools ({props.toolNames.length})</span>
            <Table class={styles.table}>
                <TableBody>
                    <For each={props.toolNames}>
                        {(name) => (
                            <TableRow class={styles.row}>
                                <TableCell class={styles.cell}>
                                    <ToolName name={name} />
                                </TableCell>
                                <TableCell class={styles.cell}>
                                    <OriginBadge toolName={name} />
                                </TableCell>
                                <TableCell class={`${styles.cell} ${styles["edit-cell"]}`}>
                                    <Button
                                        size="icon-small"
                                        variant="ghost"
                                        class={styles["edit-button"]}
                                        onClick={() => setEditingTool(name)}
                                        title=""
                                    >
                                        <Pencil size={12} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </For>
                </TableBody>
            </Table>
            <EditPolicyDialog
                toolName={editingTool() ?? ""}
                open={editingTool() !== null}
                onOpenChange={(open) => {
                    if (!open) setEditingTool(null);
                }}
            />
        </div>
    );
}
