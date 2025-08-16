
const globals = require("globals");
const pluginJs = require("@eslint/js");
const tseslint = require("typescript-eslint");


module.exports = [
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];
