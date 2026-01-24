# Solid Frontend

Astro + Solid.js frontend that shares the backend API with the Next.js frontend.

**IMPORTANT: Never edit files outside `platform/solidfrontend/` unless explicitly asked.**

## Architecture

- **Astro** - Server-side rendering, routing, View Transitions
- **Solid.js** - Client-side islands for interactivity
- **@shared** - Reuses API SDK (`archestraApiSdk`) from workspace

## Patterns

### Server-side data fetching (Astro)
```astro
---
import { archestraApiSdk } from '@shared';

// Forward cookies for auth
const cookies = Astro.request.headers.get('cookie') || '';
const { data } = await archestraApiSdk.getMcpServers({
  headers: { cookie: cookies },
});
---
<ul>
  {data?.map((item) => <li>{item.name}</li>)}
</ul>
```

### Client-side mutations (Solid)
```tsx
// Use TanStack Solid Query for mutations
import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { archestraApiSdk } from "@shared";

// Wrap components needing mutations in QueryProvider
// After mutation success, call navigate() to revalidate server data
```

### Revalidation after mutations
```ts
import { navigate } from "astro:transitions/client";
// After successful mutation:
navigate(window.location.href);
```

## Key files

- `astro.config.mjs` - Vite proxy config for `/api` requests
- `src/lib/*.query.ts` - TanStack Solid Query hooks
- `src/components/QueryProvider.tsx` - Query client wrapper

## Commands

```bash
pnpm dev      # Start dev server (port 4321)
pnpm build    # Build for production
pnpm astro check  # Type check
```
