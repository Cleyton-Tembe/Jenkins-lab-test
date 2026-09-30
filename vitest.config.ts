import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  // JSX tratado pelo transformador nativo do Vite (Rolldown/oxc),
  // o que dispensa o @vitejs/plugin-react e o conflito de Babel que ele traz.
  oxc: {
    jsx: { runtime: "automatic", importSource: "react" },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "cobertura"],
      reportsDirectory: "./coverage",
      include: ["src/actions/**", "src/components/**", "src/lib/utils.ts"],
      exclude: ["**/*.test.*", "**/ui/**", "**/*Skeleton*"],
    },
  },
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "./src") },
  },
});
