# Solidfrontend Conventions

This is a SolidJS rewrite of a NextJS frontend located in `../frontend` folder.
Whenever you are asked to port UI, port it from `../frontend`. It also has Tanstack / React queries. 

`../shared` folder has api / sdk methods and types share with the backend, which is located in `../backend` folder.

**Component Library**: Using Kobalte unstyled components as the base for UI primitives.

**Type Checking**: Skip `pnpm type-check` during the port - focus on functionality first, fix types later.

**Naming**:
- Use full variable names: `response` not `res`, `request` not `req`, `callback` not `cb`/`fn`, `event` not `e`, `error` not `err`
- Use full words for prop values: `size="small"` not `size="sm"`, `size="medium"` not `size="md"`
- Use meaningful names: `policy` not `input`, `agent` not `data`, `toolId` not `params`
- Avoid ambiguous names: `state`, `payload`, `data`, `info`, `value`, `item` - use specific names like `loadingState`, `toolPayload`, `catalogData`
- Catch exceptions, not errors: `catch (exception)` not `catch (error)`
- Name event handlers `onClick`, `onSubmit`, `onChange`, etc. not `handleClick`, `handleSubmit`, `handleChange`
- Use `save` not `upsert`
- Use sentence case for UI text: "Tool name" not "Tool Name"

**Control Flow**:
- If a function has exactly two outcomes, use if-else, not if-return
- Avoid using `fallback` prop on `<Show>` - use two separate `<Show>` tags instead for clarity:
  ```tsx
  // Good
  <Show when={condition()}>
      <ComponentA />
  </Show>
  <Show when={!condition()}>
      <ComponentB />
  </Show>

  // Avoid
  <Show when={condition()} fallback={<ComponentB />}>
      <ComponentA />
  </Show>
  ```

**Reactivity**:
- Do not use `createMemo` unless you have really expensive calculations (e.g. aggregating thousands of items)
- For derived values from props, use a simple function wrapper: `const columns = () => props.columns ?? [3, 7]`
- Never create JSX at module level - wrap in functions: `const ICONS = { foo: () => <Icon /> }` not `{ foo: <Icon /> }`

**Comments**:
- Avoid "what" comments that describe what code does
- Only add "why" comments when the reasoning isn't obvious from the code

**Icons**:
- Never import from `"lucide-solid"` directly — Vite dev mode does not tree-shake, so it loads all ~1900 icons
- Import from `@/components/icons` instead: `import { Check, X } from "@/components/icons"`
- When adding a new icon, add a deep-import line to `src/components/icons.ts`

**Data Labels**:
- Add `data-label` attributes to important elements for debugging and testing
- Use human-readable values: `data-label="Card"`, `data-label="Install"`, `data-label="Tools content"`
- Label key structural elements: containers, lists, cards, buttons, form fields
- For dynamic items, include identifier: `data-label={`MCP: ${item.name}`}`

**Styling**:
- Use lowercase or kebab-case for CSS class names: `.popover-content` not `.popoverContent`
- Use CSS variables from `theme.module.css` for theming
- Avoid specifying font-size or other graphic properties in components unless necessary (buttons, alerts or badges are an exception)
- Only use `regular` and `bold` font weights unless explicitly asked for others. `regular` is default so don't specify it unless you need to override.
- Minimize CSS in UI components outside the `primitives/` folder
- Prefer using primitives and grid layouts to achieve styling instead of custom CSS
- Avoid using extra `div`s unless it has styles:
  - Bad: `<div><Show /><Table /></div>`
  - Good: `<><Show /><Table /></>`

**Null vs Undefined**:
- Prefer `undefined` over `null` for unset/uninitialized state
- Use `null` only when a value is intentionally cleared (rare)
- Signal initial values should be `undefined`: `createSignal<T | undefined>(undefined)`

**Types**:
- Reuse types from `@shared` package via `archestraApiTypes` (see `src/types.ts`)
- Do not declare ad-hoc types in components
- Declare shared types (entities, actions) in `src/types.ts` - they are usually shared between components and queries
- Example: `type CallPolicy = archestraApiTypes.CreateToolInvocationPolicyData["body"];`
- Declare simple derivative types on the spot (e.g. `type CallPolicyDictionary = Record<string, ResultPolicy[]>`)
- Declare prop types inline on the function signature:
  ```tsx
  export function MyComponent(props: { value: string; onChange: (v: string) => void }) {
  ```

**SSR**:
- Keep it simple - don't add SSR tricks like `onMount` guards, `clientOnly`, or `isServer` checks for basic pages
- If there's a hydration issue, fix the root cause instead of adding workarounds
- Route components should just render their content directly

**Queries**:
- Do not import `action`, `createAsync`, `query`, `revalidate`, `useAction`, `useSubmission` from `@solidjs/router` in components - use query hooks from `lib/*.query.ts` instead
- Do not export helpers (e.g. revalidation functions) from query modules - handle side effects internally
- Always specify explicit return type: either `QueryResult<T>` or `MutationResult<T>`
- `QueryResult<T>` contains `data` (accessor), `query: { error, pending }`, `refetch`
- `MutationResult<T>` contains `submission: { error, pending }`, `submit`
- `data` is an accessor function - call `data()` to get the value
- Destructure with entity name: `const { data: tools, query } = useTools();`
- Access data via `tools()`, state via `query.pending` and `query.error`
- Use `submission.error` and `submission.pending` for mutation state - avoid try-catch in components
- Handle errors via `onError` callback in query definitions, not in components
- Fetch main data in route components, pass to child components as props:
  ```tsx
  // routes/tools/index.tsx
  const { data: tools, query } = useTools();
  return <ToolTable tools={tools} error={query.error} pending={query.pending} />;
  ```
