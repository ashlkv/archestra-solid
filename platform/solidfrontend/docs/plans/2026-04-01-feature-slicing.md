# Feature Slicing Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reorganize `src/` from technical layers (`components/`, `lib/`) to feature slices (`chat/`, `tools/`, `mcp-registry/`, `logs/`) so each feature owns its components, queries, and utils.

**Architecture:** Each feature slice lives at `src/<feature>/` with a `components/` subfolder for UI and query/util files alongside. Truly cross-feature code stays in `src/lib/` (agent, team, user-token queries), `src/primitives/` (generic UI), and `src/common/` (shared app-specific UI). App-level files (`api.ts`, `websocket.ts`, `icons.ts`, `Theme.tsx`) move to `src/` root.

**Tech Stack:** SolidJS, SolidStart, TypeScript, `@/` alias points to `src/`

---

### Task 1: Move `primitives/`

**Files:**
- Move: `src/components/primitives/*` → `src/primitives/*`

**Step 1: Move the directory**

```bash
mv src/components/primitives src/primitives
```

**Step 2: Update all import paths**

```bash
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/components/primitives/|@/primitives/|g'
```

**Step 3: Run type-check**

```bash
pnpm type-check
```

Expected: no errors related to primitives imports.

**Step 4: Commit**

```bash
git add -A
git commit -m "refactor: move primitives/ to src root"
```

---

### Task 2: Move `common/` (including `llm/` badges)

`components/llm/` contains display badges (AgentMiniBadge, OriginBadge, Savings) used by both `chat/` and `logs/`. They belong in `common/` alongside other shared app-specific components.

> **Note:** `components/common/Pagination.tsx` and `components/primitives/Pagination.tsx` are both present — check if they differ before moving. If they're duplicates, delete `common/Pagination.tsx`; if distinct, keep both.

**Files:**
- Move: `src/components/common/*` → `src/common/*`
- Move: `src/components/llm/*` → `src/common/*`

**Step 1: Move common**

```bash
mv src/components/common src/common
```

**Step 2: Check Pagination duplication**

```bash
diff src/common/Pagination.tsx src/primitives/Pagination.tsx
```

If identical or `common/Pagination.tsx` is unused, delete it:

```bash
# Only if confirmed unused/duplicate:
rm src/common/Pagination.tsx
```

**Step 3: Move llm/ into common/**

```bash
mv src/components/llm/* src/common/
rmdir src/components/llm
```

**Step 4: Update all import paths**

```bash
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/components/common/|@/common/|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/components/llm/|@/common/|g'
```

**Step 5: Run type-check**

```bash
pnpm type-check
```

**Step 6: Commit**

```bash
git add -A
git commit -m "refactor: move common/ and llm/ badges to src/common"
```

---

### Task 3: Move `mcp-icons/`

**Files:**
- Move: `src/components/mcp-icons/*` → `src/mcp-icons/*`

**Step 1: Move the directory**

```bash
mv src/components/mcp-icons src/mcp-icons
```

**Step 2: Update import paths**

```bash
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/components/mcp-icons/|@/mcp-icons/|g'
```

**Step 3: Run type-check**

```bash
pnpm type-check
```

**Step 4: Commit**

```bash
git add -A
git commit -m "refactor: move mcp-icons/ to src root"
```

---

### Task 4: Move app-level files to `src/` root

These files are foundational and used everywhere — they belong at the top level, not nested under `components/` or `lib/`.

**Files:**
- Move: `src/components/Theme.tsx` → `src/Theme.tsx`
- Move: `src/components/Theme.module.css` → `src/Theme.module.css`
- Move: `src/components/icons.ts` → `src/icons.ts`
- Move: `src/lib/api.ts` → `src/api.ts`
- Move: `src/lib/websocket.ts` → `src/websocket.ts`

**Step 1: Move files**

```bash
mv src/components/Theme.tsx src/Theme.tsx
mv src/components/Theme.module.css src/Theme.module.css
mv src/components/icons.ts src/icons.ts
mv src/lib/api.ts src/api.ts
mv src/lib/websocket.ts src/websocket.ts
```

**Step 2: Update import paths**

```bash
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/components/Theme|@/Theme|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/components/icons|@/icons|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' "s|@/lib/api|@/api|g"
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' "s|@/lib/websocket|@/websocket|g"
```

**Step 3: Update `app.config.ts` comment** (references old icons path)

In `app.config.ts`, update the comment from `src/components/icons` to `src/icons`.

**Step 4: Run type-check**

```bash
pnpm type-check
```

**Step 5: Commit**

```bash
git add -A
git commit -m "refactor: move app-level files (Theme, icons, api, websocket) to src root"
```

---

### Task 5: Move `chat/` slice

**Files:**
- Move: `src/components/chat/*` → `src/chat/components/*`
- Move: `src/lib/chat.query.ts` → `src/chat/chat.query.ts`
- Move: `src/lib/chat-api-keys.query.ts` → `src/chat/chat-api-keys.query.ts`
- Move: `src/lib/chat-models.query.ts` → `src/chat/chat-models.query.ts`
- Move: `src/lib/chat-tools.query.ts` → `src/chat/chat-tools.query.ts`
- Move: `src/lib/chat-utils.ts` → `src/chat/chat-utils.ts`
- Move: `src/lib/chat/create-chat.ts` → `src/chat/create-chat.ts`
- Move: `src/lib/pending-tool-state.ts` → `src/chat/pending-tool-state.ts`

**Step 1: Create directory and move files**

```bash
mkdir -p src/chat/components
mv src/components/chat/* src/chat/components/
rmdir src/components/chat
mv src/lib/chat.query.ts src/chat/
mv src/lib/chat-api-keys.query.ts src/chat/
mv src/lib/chat-models.query.ts src/chat/
mv src/lib/chat-tools.query.ts src/chat/
mv src/lib/chat-utils.ts src/chat/
mv src/lib/chat/create-chat.ts src/chat/
mv src/lib/pending-tool-state.ts src/chat/
rmdir src/lib/chat
```

**Step 2: Update import paths for consumers**

```bash
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/components/chat/|@/chat/components/|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/lib/chat\.query|@/chat/chat.query|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/lib/chat-api-keys\.query|@/chat/chat-api-keys.query|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/lib/chat-models\.query|@/chat/chat-models.query|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/lib/chat-tools\.query|@/chat/chat-tools.query|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/lib/chat-utils|@/chat/chat-utils|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/lib/chat/create-chat|@/chat/create-chat|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/lib/pending-tool-state|@/chat/pending-tool-state|g'
```

**Step 3: Run type-check**

```bash
pnpm type-check
```

**Step 4: Commit**

```bash
git add -A
git commit -m "refactor: move chat/ slice to src/chat"
```

---

### Task 6: Move `tools/` slice

**Files:**
- Move: `src/components/tools/*` → `src/tools/components/*` (including `policy/` subdir)
- Move: `src/lib/tool.query.ts` → `src/tools/tool.query.ts`
- Move: `src/lib/policy.query.ts` → `src/tools/policy.query.ts`
- Move: `src/lib/policy.utils.ts` → `src/tools/policy.utils.ts`

**Step 1: Create directory and move files**

```bash
mkdir -p src/tools/components
mv src/components/tools/* src/tools/components/
rmdir src/components/tools
mv src/lib/tool.query.ts src/tools/
mv src/lib/policy.query.ts src/tools/
mv src/lib/policy.utils.ts src/tools/
```

**Step 2: Update import paths**

```bash
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/components/tools/|@/tools/components/|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/lib/tool\.query|@/tools/tool.query|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/lib/policy\.query|@/tools/policy.query|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/lib/policy\.utils|@/tools/policy.utils|g'
```

**Step 3: Run type-check**

```bash
pnpm type-check
```

**Step 4: Commit**

```bash
git add -A
git commit -m "refactor: move tools/ slice to src/tools"
```

---

### Task 7: Move `mcp-registry/` slice

**Files:**
- Move: `src/components/mcp-registry/*` → `src/mcp-registry/components/*`
- Move: `src/lib/mcp-registry.query.ts` → `src/mcp-registry/mcp-registry.query.ts`
- Move: `src/lib/mcp-server.query.ts` → `src/mcp-registry/mcp-server.query.ts`

**Step 1: Create directory and move files**

```bash
mkdir -p src/mcp-registry/components
mv src/components/mcp-registry/* src/mcp-registry/components/
rmdir src/components/mcp-registry
mv src/lib/mcp-registry.query.ts src/mcp-registry/
mv src/lib/mcp-server.query.ts src/mcp-registry/
```

**Step 2: Update import paths**

```bash
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/components/mcp-registry/|@/mcp-registry/components/|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/lib/mcp-registry\.query|@/mcp-registry/mcp-registry.query|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/lib/mcp-server\.query|@/mcp-registry/mcp-server.query|g'
```

**Step 3: Run type-check**

```bash
pnpm type-check
```

**Step 4: Commit**

```bash
git add -A
git commit -m "refactor: move mcp-registry/ slice to src/mcp-registry"
```

---

### Task 8: Move `logs/` slice

**Files:**
- Move: `src/components/logs/*` → `src/logs/components/*` (including `chat/` subdir)
- Move: `src/lib/interaction.query.ts` → `src/logs/interaction.query.ts`
- Move: `src/lib/interaction.utils.ts` → `src/logs/interaction.utils.ts`
- Move: `src/lib/mcp-tool-call.query.ts` → `src/logs/mcp-tool-call.query.ts`
- Move: `src/lib/dual-llm-result.query.ts` → `src/logs/dual-llm-result.query.ts`

**Step 1: Create directory and move files**

```bash
mkdir -p src/logs/components
mv src/components/logs/* src/logs/components/
rmdir src/components/logs
mv src/lib/interaction.query.ts src/logs/
mv src/lib/interaction.utils.ts src/logs/
mv src/lib/mcp-tool-call.query.ts src/logs/
mv src/lib/dual-llm-result.query.ts src/logs/
```

**Step 2: Update import paths**

```bash
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/components/logs/|@/logs/components/|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/lib/interaction\.query|@/logs/interaction.query|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/lib/interaction\.utils|@/logs/interaction.utils|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/lib/mcp-tool-call\.query|@/logs/mcp-tool-call.query|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/lib/dual-llm-result\.query|@/logs/dual-llm-result.query|g'
```

**Step 3: Run type-check**

```bash
pnpm type-check
```

**Step 4: Commit**

```bash
git add -A
git commit -m "refactor: move logs/ slice to src/logs"
```

---

### Task 9: Move `sidebar/` and `ui-demo/`

**Files:**
- Move: `src/components/sidebar/*` → `src/sidebar/components/*`
- Move: `src/components/ui-demo/*` → `src/ui-demo/*`

**Step 1: Move files**

```bash
mkdir -p src/sidebar/components
mv src/components/sidebar/* src/sidebar/components/
rmdir src/components/sidebar

mv src/components/ui-demo src/ui-demo
```

**Step 2: Update import paths**

```bash
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/components/sidebar/|@/sidebar/components/|g'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/components/ui-demo/|@/ui-demo/|g'
```

**Step 3: Run type-check**

```bash
pnpm type-check
```

**Step 4: Commit**

```bash
git add -A
git commit -m "refactor: move sidebar/ and ui-demo/ slices to src root"
```

---

### Task 10: Move `llm-providers/` and clean up

**Files:**
- Move: `src/lib/llm-providers/*` → `src/llm-providers/*`
- Verify `src/lib/` now contains only `agent.query.ts`, `team.query.ts`, `user-token.query.ts`
- Verify `src/components/` is now empty and remove it

**Step 1: Move llm-providers**

```bash
mv src/lib/llm-providers src/llm-providers
```

**Step 2: Update import paths**

```bash
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|@/lib/llm-providers/|@/llm-providers/|g'
```

**Step 3: Verify lib/ and components/ state**

```bash
ls src/lib/
# Expected: agent.query.ts  team.query.ts  user-token.query.ts

ls src/components/ 2>/dev/null && echo "WARNING: components/ not empty" || echo "components/ removed or empty"
```

Remove `src/components/` if empty:

```bash
rmdir src/components 2>/dev/null || echo "components/ still has files — investigate"
```

**Step 4: Run full type-check and tests**

```bash
pnpm type-check
pnpm test
```

Expected: all pass.

**Step 5: Commit**

```bash
git add -A
git commit -m "refactor: move llm-providers/ to src root, clean up empty lib/ and components/"
```

---

## Final Structure

```
src/
  chat/
    components/       ← AgentSelector, ChatHistory, PromptInput, …
    chat.query.ts
    chat-api-keys.query.ts
    chat-models.query.ts
    chat-tools.query.ts
    chat-utils.ts
    create-chat.ts
    pending-tool-state.ts
  tools/
    components/       ← ToolTable, ToolDrawer, AssignmentsPopover, policy/…
    tool.query.ts
    policy.query.ts
    policy.utils.ts
  mcp-registry/
    components/       ← McpRegistry, McpCard, McpInstallDialog, …
    mcp-registry.query.ts
    mcp-server.query.ts
  logs/
    components/       ← LlmProxyLogsPage, SessionsTable, InteractionDrawer, chat/…
    interaction.query.ts
    interaction.utils.ts
    mcp-tool-call.query.ts
    dual-llm-result.query.ts
  sidebar/
    components/       ← Sidebar, SidebarHeader
  ui-demo/            ← UiLayout, UiLayout.utils.ts
  primitives/         ← Button, Dialog, Table, Input, … (generic UI)
  common/             ← JsonHighlight, EditableText, AgentMiniBadge, OriginBadge, …
  mcp-icons/          ← IconGitHub, IconJira, icon-registry.ts, …
  llm-providers/      ← anthropic.ts, openai.ts, …
  lib/                ← agent.query.ts, team.query.ts, user-token.query.ts
  routes/             ← unchanged (SolidStart file-based routing)
  app.tsx
  api.ts
  websocket.ts
  icons.ts
  Theme.tsx
  Theme.module.css
  types.ts
  global.d.ts
  entry-client.tsx
  entry-server.tsx
```
