/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import eslint from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';
import packageJson from 'eslint-plugin-package-json';
import perfectionist from 'eslint-plugin-perfectionist';
import security from 'eslint-plugin-security';
import { configs as sonarjsConfigs } from 'eslint-plugin-sonarjs';
import tsdoc from 'eslint-plugin-tsdoc';
import unicorn from 'eslint-plugin-unicorn';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['.github/**', '.stryker-tmp/**', 'coverage/**', 'dist/**'],
  },
  eslint.configs.recommended,
  unicorn.configs.recommended,
  perfectionist.configs['recommended-natural'],
  security.configs.recommended,
  sonarjsConfigs.recommended,
  {
    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    files: ['**/*.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.nodeBuiltin,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
      reportUnusedInlineConfigs: 'error',
    },
    plugins: {
      tsdoc,
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/promise-function-async': [
        'error',
        {
          checkArrowFunctions: true,
          checkFunctionDeclarations: true,
          checkFunctionExpressions: true,
          checkMethodDeclarations: true,
        },
      ],
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true },
      ],
      '@typescript-eslint/return-await': ['error', 'in-try-catch'],
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowNullableObject: true,
          allowNumber: false,
          allowString: false,
        },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      'no-console': 'error',
      'no-extend-native': 'error',
      'no-proto': 'error',
      'tsdoc/syntax': 'error',
      'unicorn/no-asterisk-prefix-in-documentation-comments': 'off',
      'unicorn/no-process-exit': 'off',
      'unicorn/no-repeated-call-wrappers': 'error',
      'unicorn/no-unnecessary-default-arguments': 'error',
    },
  },
  {
    files: ['test/**/*.test.ts'],
    plugins: { vitest },
    rules: {
      ...vitest.configs.all.rules,
      'vitest/prefer-expect-assertions': 'off',
      'vitest/valid-expect': [
        'error',
        {
          maxArgs: 2,
        },
      ],
    },
  },
  {
    extends: [packageJson.configs.recommended, packageJson.configs.stylistic],
    files: ['package.json'],
    rules: {
      'package-json/no-local-dependencies': 'error',
      'package-json/require-author': 'error',
      'package-json/require-bugs': 'error',
      'package-json/require-dependencies': 'error',
      'package-json/require-devDependencies': 'error',
      'package-json/require-devEngines': 'error',
      'package-json/require-engines': 'error',
      'package-json/require-homepage': 'error',
      'package-json/require-keywords': 'error',
      'package-json/require-private': 'error',
      'package-json/require-scripts': 'error',
      'package-json/restrict-dependency-ranges': [
        'error',
        {
          forDependencyTypes: ['dependencies', 'devDependencies'],
          rangeType: 'pin',
        },
      ],
      'package-json/restrict-private-properties': 'error',
    },
  },
  eslintConfigPrettier,
]);
