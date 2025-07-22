import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Temporarily disable rules for migration - REMOVE THESE AFTER FIXING
      "@typescript-eslint/no-explicit-any": "warn", // Change from error to warning during migration
      "@typescript-eslint/no-unused-vars": "warn",
      "react/no-unescaped-entities": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "@next/next/no-img-element": "warn",
      
      // Keep these rules as errors for security and best practices
      "no-console": "warn",
      "prefer-const": "error",
    },
  },
];

export default eslintConfig;
