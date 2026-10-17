/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { UserConfigFn } from 'tsdown';

import path from 'node:path';
import license from 'rollup-plugin-license';

export default ((): ReturnType<UserConfigFn> => ({
  clean: true,
  deps: {
    alwaysBundle: [/.*/],
    onlyBundle: false,
  },
  dts: false,
  entry: ['src/index.ts'],
  format: ['esm'],
  logLevel: 'warn',
  outDir: 'dist',
  outputOptions: {
    codeSplitting: false,
  },
  platform: 'node',
  plugins: [
    license({
      banner: {
        commentStyle: 'ignored',
        content: {
          file: path.join(import.meta.dirname, 'LICENSE.txt'),
        },
      },
      thirdParty: {
        allow: {
          failOnUnlicensed: true,
          failOnViolation: true,
          test: '(MIT OR Apache-2.0 OR ISC OR BSD-2-Clause OR BSD-3-Clause OR 0BSD)',
        },
        includePrivate: false,
        multipleVersions: true,
        output: {
          file: path.join(
            import.meta.dirname,
            'dist',
            'THIRD-PARTY-LICENSES.txt',
          ),
        },
      },
    }),
  ],
  shims: true,
  target: 'node24',
})) satisfies UserConfigFn;
