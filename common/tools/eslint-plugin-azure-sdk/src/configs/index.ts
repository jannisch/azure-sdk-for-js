// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import eslint from "@eslint/js";
import typescriptEslint from "typescript-eslint";
import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import markdown from "eslint-plugin-markdown";
import promise from "eslint-plugin-promise";

import eslintCustomized from "./eslint-customized";
import markdownCustomized from "./markdown-customized";
import azureSdkCustomized from "./azure-sdk-customized";

// to keep compat with old .eslintrc style usage
import rootConfig from "./azure-sdk-base";

function recommended(plugin: FlatConfig.Plugin, options: { typeChecked: boolean }) {
  return typescriptEslint.config(
    {
      ignores: ["**/generated/**", "**/*.config.{js,cjs,mjs}"],
    },
    {
      languageOptions: {
        parser: typescriptEslint.parser,
        parserOptions: {
          project: ["./tsconfig.json"],
        },
      },
    },
    eslint.configs.recommended,
    ...(options.typeChecked
      ? typescriptEslint.configs.recommendedTypeChecked
      : typescriptEslint.configs.recommended),
    typescriptEslint.configs.eslintRecommended,
    eslintConfigPrettier,
    {
      plugins: {
        "@azure/azure-sdk": plugin,
        markdown,
        promise,
      },
    },

    promise.configs["flat/recommended"],

    // azure sdk customized
    eslintCustomized,
    ...markdownCustomized,
    ...azureSdkCustomized(typescriptEslint.parser),
  );
}

export default (plugin: FlatConfig.Plugin) => ({
  recommended: recommended(plugin, { typeChecked: false }),
  recommendedTypeChecked: recommended(plugin, { typeChecked: true }),
  "recommended-legacy": {
    plugins: ["@azure/azure-sdk"],
    env: {
      node: true,
    },
    parser: "@typescript-eslint/parser",
    rules: {
      "@azure/azure-sdk/github-source-headers": "error",
      "@azure/azure-sdk/ts-apiextractor-json-types": "error",
      "@azure/azure-sdk/ts-apisurface-standardized-verbs": "error",
      "@azure/azure-sdk/ts-apisurface-supportcancellation": "error",
      "@azure/azure-sdk/ts-config-include": "error",
      "@azure/azure-sdk/ts-doc-internal": "error",
      "@azure/azure-sdk/ts-doc-internal-private-member": "warn",
      "@azure/azure-sdk/ts-error-handling": "off",
      "@azure/azure-sdk/ts-modules-only-named": "error",
      "@azure/azure-sdk/ts-naming-drop-noun": "error",
      "@azure/azure-sdk/ts-naming-options": "error",
      "@azure/azure-sdk/ts-naming-subclients": "error",
      "@azure/azure-sdk/ts-no-const-enums": "warn",
      "@azure/azure-sdk/ts-no-window": "error",
      "@azure/azure-sdk/ts-package-json-author": "error",
      "@azure/azure-sdk/ts-package-json-bugs": "error",
      "@azure/azure-sdk/ts-package-json-engine-is-present": "error",
      "@azure/azure-sdk/ts-package-json-files-required": "error",
      "@azure/azure-sdk/ts-package-json-homepage": "error",
      "@azure/azure-sdk/ts-package-json-keywords": "error",
      "@azure/azure-sdk/ts-package-json-license": "error",
      "@azure/azure-sdk/ts-package-json-main-is-cjs": "error",
      "@azure/azure-sdk/ts-package-json-module": "error",
      "@azure/azure-sdk/ts-package-json-name": "error",
      "@azure/azure-sdk/ts-package-json-repo": "error",
      "@azure/azure-sdk/ts-package-json-required-scripts": "error",
      "@azure/azure-sdk/ts-package-json-sdktype": "error",
      "@azure/azure-sdk/ts-package-json-sideeffects": "error",
      "@azure/azure-sdk/ts-package-json-types": "error",
      "@azure/azure-sdk/ts-pagination-list": "error",
      "@azure/azure-sdk/ts-use-interface-parameters": "warn",
      "@azure/azure-sdk/ts-use-promises": "error",
      "@azure/azure-sdk/ts-versioning-semver": "error",
    },
    settings: {
      main: "src/index.ts",
    },
  },
  "azure-sdk-base": rootConfig,
  internal: typescriptEslint.config(
    {
      ignores: ["**/generated/**", "**/*.config.{js,cjs,mjs}"],
    },
    {
      languageOptions: {
        parser: typescriptEslint.parser,
        parserOptions: {
          project: ["./tsconfig.json"],
        },
      },
    },
    eslint.configs.recommended,
    ...typescriptEslint.configs.recommended,
    typescriptEslint.configs.eslintRecommended,
    eslintConfigPrettier,
    {
      plugins: {
        "@azure/azure-sdk": plugin,
      },
    },
    {
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "@azure/azure-sdk/github-source-headers": "warn",
        "@azure/azure-sdk/ts-apisurface-standardized-verbs": "off",
        "@azure/azure-sdk/ts-apisurface-supportcancellation": "off",
        "@azure/azure-sdk/ts-config-include": "off",
        "@azure/azure-sdk/ts-doc-internal": "off",
        "@azure/azure-sdk/ts-doc-internal-private-member": "off",
        "@azure/azure-sdk/ts-error-handling": "off",
        "@azure/azure-sdk/ts-modules-only-named": "off",
        "@azure/azure-sdk/ts-naming-drop-noun": "off",
        "@azure/azure-sdk/ts-naming-options": "off",
        "@azure/azure-sdk/ts-naming-subclients": "off",
        "@azure/azure-sdk/ts-no-const-enums": "off",
        "@azure/azure-sdk/ts-no-window": "warn",
        "@azure/azure-sdk/ts-pagination-list": "off",
        "@azure/azure-sdk/ts-use-interface-parameters": "off",
        "@azure/azure-sdk/ts-use-promises": "warn",
        "@azure/azure-sdk/ts-versioning-semver": "off",
      },
    },
  ),
});
