import { defineConfig } from "@solidjs/start/config";
import { resolve } from "path";

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
        resolve: {
            alias: {
                "@": resolve("./src"),
            },
        },
    },
});
