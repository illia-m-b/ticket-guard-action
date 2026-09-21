/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: false,
  platform: 'node',
  target: 'node24',
  entry: ['src/index.ts'],
  format: ['esm'],
  minify: 'terser',
  silent: true,
  sourcemap: true,
});
