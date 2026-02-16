import { createEffect, createSignal, Show } from "solid-js";
import { useMcpServers } from "@/lib/mcp-registry.query";
import { useTeams } from "@/lib/team.query";
import type { MCP, McpServer, Team } from "@/types";
import { RadioGroup } from "../primitives/RadioGroup";
import { Select } from "../primitives/Select";
import styles from "./SelectCredentialTypeAndTeams.module.css";

type Props = {
    selectedTeamId: string | undefined;
    onTeamChange: (teamId: string | undefined) => void;
    catalogId?: string;
    onCredentialTypeChange?: (type: "personal" | "team") => void;
};

export function SelectCredentialTypeAndTeams(props: Props) {
    const { data: teams, query: teamsQuery } = useTeams();
    const { data: mcpServers } = useMcpServers();
    const [credentialType, setCredentialType] = createSignal<"personal" | "team">("personal");

    const installedServers = () => {
        if (!props.catalogId) return [];
        return (mcpServers() ?? []).filter((server) => server.catalogId === props.catalogId);
    };

    const hasPersonalInstallation = () => installedServers().some((server) => !server.teamId);

    const teamsWithInstallation = () =>
        installedServers()
            .filter((server): server is McpServer & { teamId: string } => Boolean(server.teamId))
            .map((server) => server.teamId);

    const availableTeams = () => {
        const allTeams = teams() ?? [];
        if (!props.catalogId) return allTeams;
        const installed = teamsWithInstallation();
        return allTeams.filter((team) => !installed.includes(team.id));
    };

    const isPersonalDisabled = () => hasPersonalInstallation();
    const isTeamDisabled = () => availableTeams().length === 0;

    const radioOptions = () => [
        {
            value: "personal",
            label: isPersonalDisabled() ? "Personal (already installed)" : "Personal",
            disabled: isPersonalDisabled(),
        },
        {
            value: "team",
            label: isTeamDisabled()
                ? `Team (${(teams() ?? []).length === 0 ? "no teams available" : "all teams already have this server"})`
                : "Team",
            disabled: isTeamDisabled(),
        },
    ];

    const teamOptions = () => availableTeams().map((team) => ({ value: team.id, label: team.name }));

    // Auto-switch to team when personal is disabled
    createEffect(() => {
        if (isPersonalDisabled() && !isTeamDisabled()) {
            setCredentialType("team");
            props.onCredentialTypeChange?.("team");
        }
    });

    // Auto-select first available team when switching to team mode
    createEffect(() => {
        if (credentialType() === "team") {
            const first = availableTeams()[0];
            if (first) {
                props.onTeamChange(first.id);
            }
        }
    });

    const onCredentialTypeChange = (value: string) => {
        const type = value as "personal" | "team";
        setCredentialType(type);
        props.onCredentialTypeChange?.(type);
        if (type === "personal") {
            props.onTeamChange(undefined);
        }
    };

    return (
        <div class={styles.root}>
            <div class={styles.section}>
                <span class={styles.label}>Credential type</span>
                <RadioGroup value={credentialType()} onChange={onCredentialTypeChange} options={radioOptions()} />
            </div>

            <Show when={credentialType() === "team"}>
                <div class={styles.section}>
                    <span class={styles.label}>
                        Team <span class={styles.required}>*</span>
                    </span>
                    <Select
                        value={props.selectedTeamId ?? ""}
                        onChange={(value) => props.onTeamChange(value || undefined)}
                        options={teamOptions()}
                        placeholder={teamsQuery.pending ? "Loading teams..." : "Select a team"}
                        disabled={teamsQuery.pending}
                        loading={teamsQuery.pending}
                    />
                    <Show when={availableTeams().length === 0 && !teamsQuery.pending}>
                        <p class={styles.hint}>No teams available. Create a team first to share this server.</p>
                    </Show>
                </div>
            </Show>
        </div>
    );
}
