/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { defineConfig } from 'tsup';
import { generateLicenseFile } from 'generate-license-file';

export default defineConfig({
  clean: true,
  dts: false,
  platform: 'node',
  target: 'node24',
  entry: ['src/index.ts'],
  format: ['esm'],
  minify: true,
  noExternal: [/.*/],
  silent: true,
  sourcemap: true,
  async onSuccess(): Promise<void> {
    await generateLicenseFile(
      './package.json',
      './dist/THIRD-PARTY-LICENSES.txt',
      {
        lineEnding: 'lf',
        omitVersions: false,
      },
    );
  },
});
