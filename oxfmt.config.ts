/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { OxfmtConfig } from 'oxfmt';

export default {
  endOfLine: 'lf',
  ignorePatterns: ['CHANGELOG.md', 'dist/**'],
  jsdoc: {
    commentLineStrategy: 'multiline',
    descriptionWithDot: true,
    preferCodeFences: true,
    separateReturnsFromParam: true,
    separateTagGroups: true,
  },
  printWidth: 80,
  semi: true,
  singleQuote: true,
  sortPackageJson: {
    sortScripts: true,
  },
  tabWidth: 2,
  trailingComma: 'all',
} satisfies OxfmtConfig;
