import path from "node:path";

export default {
    root: path.resolve(__dirname),
    esbuild: {
        jsx: "automatic",
        jsxImportSource: "solid-js",
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@shared/access-control": path.resolve(__dirname, "../shared/access-control.ts"),
            "@shared": path.resolve(__dirname, "../shared/index.ts"),
        },
    },
    test: {
        globals: true,
        include: ["./src/**/*.test.{ts,tsx}"],
        environment: "jsdom",
    },
};
