import { Show } from "solid-js";
import { Ellipsis, FileText, Info, Layers, Pencil, RefreshCcw, Trash2 } from "@/components/icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../primitives/DropdownMenu";

type Props = {
    isLocal?: boolean;
    isInstalled?: boolean;
    onLogs?: () => void;
    onRestart?: () => void;
    onManageInstallations?: () => void;
    onAbout?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    class?: string;
};

export function McpCardMenu(props: Props) {
    const stopPropagation = (event: MouseEvent) => event.stopPropagation();

    return (
        <div class={props.class} onClick={stopPropagation}>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Ellipsis size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <Show when={props.isInstalled}>
                        <DropdownMenuItem onClick={props.onLogs} disabled={!props.isLocal}>
                            <FileText size={16} />
                            Logs
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={props.onRestart} disabled={!props.isLocal}>
                            <RefreshCcw size={16} />
                            Restart
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={props.onManageInstallations}>
                            <Layers size={16} />
                            Manage instances
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={props.onEdit}>
                            <Pencil size={16} />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </Show>
                    <DropdownMenuItem onClick={props.onAbout}>
                        <Info size={16} />
                        About
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={props.onDelete} variant="destructive">
                        <Trash2 size={16} />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
