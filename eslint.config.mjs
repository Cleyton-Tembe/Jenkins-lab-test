import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    // Codigo gerado pelo Prisma: nao e escrito por nos, nao se linta.
    "src/generated/**",

    // Artefactos de teste gerados pela pipeline.
    "coverage/**",
    "reports/**",
  ]),
]);

export default eslintConfig;
