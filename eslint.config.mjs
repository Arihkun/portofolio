import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [".next/**", "node_modules/**", "out/**", "dist/**", ".vinext/**", ".cloudflare/**", "lib/generated/**", "next-env.d.ts"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ["scripts/*.mjs"], languageOptions: { globals: globals.node } },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
    },
  },
);
