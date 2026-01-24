// @ts-check
import { defineConfig } from "astro/config";

import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
    integrations: [solidJs()],
    // Server mode for dynamic SSR (not static generation)
    output: "server",
    // Enable View Transitions for SPA-like navigation
    prefetch: true,
    vite: {
        define: {
            "process.env": {},
        },
        server: {
            proxy: {
                "/api": {
                    target: "http://localhost:9000",
                    changeOrigin: true,
                },
            },
        },
    },
});
