/**
 * Manages pending tool enable/disable state before a conversation is created.
 * State is stored in localStorage and applied when the first message is sent.
 */

const STORAGE_KEY = "archestra-pending-tool-state";

export type PendingToolAction =
    | { type: "enable"; toolId: string }
    | { type: "disable"; toolId: string }
    | { type: "enableAll"; toolIds: string[] }
    | { type: "disableAll"; toolIds: string[] };

interface PendingToolState {
    actions: PendingToolAction[];
    agentId: string | null;
}

/**
 * Add a pending tool action.
 * If agentId changed, clears previous actions first.
 */
export function addPendingAction(action: PendingToolAction, agentId: string | null): void {
    const state = getState();

    if (state.agentId !== agentId) {
        setState({ actions: [action], agentId });
        return;
    }

    setState({ ...state, actions: [...state.actions, action] });
}

/**
 * Get all pending actions for the given agent.
 * Returns empty array if agent doesn't match.
 */
export function getPendingActions(agentId: string | null): PendingToolAction[] {
    const state = getState();
    if (state.agentId !== agentId) return [];
    return state.actions;
}

/**
 * Clear all pending actions.
 */
export function clearPendingActions(): void {
    localStorage.removeItem(STORAGE_KEY);
}

/**
 * Apply pending actions to a base set of enabled tool IDs.
 * Returns the new set of enabled tool IDs after applying all actions.
 */
export function applyPendingActions(baseEnabledToolIds: string[], actions: PendingToolAction[]): string[] {
    const enabledIds = new Set(baseEnabledToolIds);

    for (const action of actions) {
        switch (action.type) {
            case "enable":
                enabledIds.add(action.toolId);
                break;
            case "disable":
                enabledIds.delete(action.toolId);
                break;
            case "enableAll":
                for (const id of action.toolIds) enabledIds.add(id);
                break;
            case "disableAll":
                for (const id of action.toolIds) enabledIds.delete(id);
                break;
        }
    }

    return Array.from(enabledIds);
}

// ---------------------------------------------------------------------------
// Internal
// ---------------------------------------------------------------------------

function getState(): PendingToolState {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch {
        // Ignore parse errors
    }
    return { actions: [], agentId: null };
}

function setState(state: PendingToolState): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
