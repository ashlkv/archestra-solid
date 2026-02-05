import { defineConfig } from "@solidjs/start/config";
import { resolve } from "path";
import devtools from "solid-devtools/vite";

// Vite dev mode does not tree-shake, so barrel imports (e.g. `from "lucide-solid"`)
// load every module in the package. For lucide-solid this means ~1900 icons.
// Use the local barrel file `@/components/icons` which deep-imports only used icons.
// Never import directly from "lucide-solid" — add new icons to `src/components/icons.ts`.
export default defineConfig({
    server: {
        // Proxy API requests to backend.
        // Uses Nitro routeRules (like Next.js rewrites) which forwards all headers including cookies.
        // Note: devProxy strips cookies - don't use it for authenticated requests.
        routeRules: {
            "/api/**": {
                proxy: "http://localhost:9000/api/**",
            },
        },
    },
    vite: {
        plugins: [
            // Enables Solid DevTools browser extension with proper signal/memo names
            devtools({ autoname: true }),
        ],
        resolve: {
            alias: {
                "@": resolve("./src"),
            },
        },
    },
});
