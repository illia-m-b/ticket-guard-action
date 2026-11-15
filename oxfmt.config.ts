/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { OxfmtConfig } from 'oxfmt';

export default {
  ignorePatterns: ['CHANGELOG.md', 'dist/**'],
  jsdoc: {
    commentLineStrategy: 'multiline',
    descriptionWithDot: true,
    preferCodeFences: true,
    separateReturnsFromParam: true,
    separateTagGroups: true,
  },
  printWidth: 80,
  singleQuote: true,
  sortImports: {
    groups: [
      'type-import',
      ['value-builtin', 'value-external'],
      ['type-internal', 'type-subpath'],
      ['value-internal', 'value-subpath'],
      ['type-parent', 'type-sibling', 'type-index'],
      ['value-parent', 'value-sibling', 'value-index'],
      'unknown',
    ],
  },
  sortPackageJson: {
    sortScripts: true,
  },
} satisfies OxfmtConfig;
