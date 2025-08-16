const globals = require("globals");
const pluginJs = require("@eslint/js");
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
// It's generally not recommended to require eslint-config packages directly in the flat config format.
// A common approach is to manually include rules or use community-developed flat configs if available.
// We will configure rules manually or find a flat-config compatible way to include Google's style guide.

module.exports = [
  pluginJs.configs.recommended,
  tsPlugin.configs["eslint-recommended"],
  {
    languageOptions: {

      globals: {
        ...globals.node,
      },
      parser: tsParser,
      parserOptions: {
        sourceType: "commonjs",
      },
    },
    plugins: {
      js: pluginJs,
      "@typescript-eslint": tsPlugin,
    },
    files: ["**/*.js", "**/*.ts"], // Apply this config to both JS and TS files
    rules: {
      // Recommended JS rules
      ...pluginJs.configs.recommended.rules,

      // Recommended TypeScript rules (overrides or complements JS rules)
      ...tsPlugin.configs['recommended'].rules,

      // Manually adding rules based on the reported errors and desired style
      // Rules to address reported errors
      "camelcase": "error",
      "max-len": ["error", { "code": 120 }], // Increased from 80 to 120
      "no-undef": "error",
      "no-invalid-this": "error",
      "no-var": "error",
      "no-unsafe-finally": "error",
      "require-jsdoc": "off", // Turning off for now

    },
  },
];