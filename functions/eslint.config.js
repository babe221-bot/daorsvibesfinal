const globals = require("globals");
const pluginJs = require("@eslint/js");
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");

module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: "commonjs",
    },
    plugins: {
      js: pluginJs,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      "camelcase": "error",
      "max-len": ["error", { "code": 120 }],
      "no-undef": "error",
      "no-invalid-this": "error",
      "no-var": "error",
      "no-unsafe-finally": "error",
      "require-jsdoc": "off",
    },
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser: tsParser,
      sourceType: "commonjs",
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs["recommended"].rules,
      "camelcase": "error",
      "max-len": ["error", { "code": 120 }],
      "no-undef": "error",
      "no-invalid-this": "error",
      "no-var": "error",
      "no-unsafe-finally": "error",
      "require-jsdoc": "off",
    },
  },
];
