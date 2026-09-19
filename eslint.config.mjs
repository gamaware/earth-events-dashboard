import { fixupConfigRules } from "@eslint/compat";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// eslint-config-next still depends on eslint-plugin-react 7.x, which calls
// context methods that ESLint 10 removed (getFilename, getScope, ...).
// fixupConfigRules restores those methods on the rule context without
// changing which rules run or how strict they are.
const eslintConfig = defineConfig([
  ...fixupConfigRules(nextVitals),
  ...fixupConfigRules(nextTs),
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    rules: {
      "no-eval": "error",
      "no-implied-eval": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "error",
      eqeqeq: "error",
    },
  },
]);

export default eslintConfig;
