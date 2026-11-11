import { defineConfig } from "vite";

/**
 * Standalone static build. Relative base so the demo works at the GitHub
 * Pages project URL and from a nested folder.
 */
export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "es2022",
    minify: "esbuild",
    sourcemap: false,
    chunkSizeWarningLimit: 4000,
  },
});
