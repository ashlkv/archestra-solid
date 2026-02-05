import { createSignal } from "solid-js";
import type { MCP, NoAuthInstallResult } from "@/types";
import { Dialog, DialogContent } from "../primitives/Dialog";
import { Button } from "../primitives/Button";
import { SelectCredentialTypeAndTeams } from "./SelectCredentialTypeAndTeams";
import styles from "./install-dialog.module.css";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    catalogItem: MCP | null;
    installing: boolean;
    onInstall: (result: NoAuthInstallResult) => Promise<void>;
};

export function NoAuthInstallDialog(props: Props) {
    const [selectedTeamId, setSelectedTeamId] = createSignal<string | null>(null);

    const onInstall = async () => {
        await props.onInstall({ teamId: selectedTeamId() });
    };

    const onClose = () => {
        setSelectedTeamId(null);
        props.onOpenChange(false);
    };

    return (
        <Dialog open={props.open} onOpenChange={onClose}>
            <DialogContent title={`Install ${props.catalogItem?.name ?? ""}`}>
                <div class={styles.form}>
                    <p class={styles["no-auth-description"]}>
                        This MCP server doesn't require authentication. Click install to proceed.
                    </p>

                    <SelectCredentialTypeAndTeams
                        selectedTeamId={selectedTeamId()}
                        onTeamChange={setSelectedTeamId}
                        catalogId={props.catalogItem?.id}
                    />

                    <div class={styles.footer}>
                        <Button variant="outline" onClick={onClose} disabled={props.installing}>
                            Cancel
                        </Button>
                        <Button onClick={onInstall} disabled={props.installing}>
                            {props.installing ? "Installing..." : "Install"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
