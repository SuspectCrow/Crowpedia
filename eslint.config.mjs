import js from "@eslint/js";
import expo from "eslint-config-expo/flat.js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.expo/**",
      "**/web-build/**",
    ],
  },
  js.configs.recommended,
  ...expo,
];
