import { useNavigate } from "@solidjs/router";
import { For, type JSX } from "solid-js";
import { PencilButton } from "@/components/primitives/PencilButton";
import { Table, TableBody, TableCell, TableRow } from "@/components/primitives/Table";
import { OriginBadge } from "@/components/tools/OriginBadge";
import { ToolName } from "@/components/tools/ToolName";
import { useTools } from "@/lib/tool.query";
import styles from "./SessionToolsTable.module.css";

export function SessionToolsTable(props: { toolNames: string[] }): JSX.Element {
    const navigate = useNavigate();
    const { data: tools } = useTools(() => ({ limit: 100, offset: 0 }));

    const navigateToTool = (toolName: string) => {
        const tool = tools()?.find((t) => t.name === toolName);
        if (tool) {
            navigate(`/tools/${tool.id}`);
        }
    };

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
                                    <PencilButton
                                        tooltip="Edit policy"
                                        size="icon-small"
                                        variant="ghost"
                                        class={styles["edit-button"]}
                                        onClick={() => navigateToTool(name)}
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </For>
                </TableBody>
            </Table>
        </div>
    );
}
