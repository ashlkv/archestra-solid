import { defineConfig } from "@solidjs/start/config";
import { resolve } from "path";
import devtools from "solid-devtools/vite";

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
