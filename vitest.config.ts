/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      exclude: ['src/index.ts'],
      include: [
        'src/**/*.ts',
        'test/captured/captured.ts',
        'test/silenced/silenced.ts',
      ],
      provider: 'v8',
      reporter: ['text', 'lcov'],
      skipFull: true,
      thresholds: {
        100: true,
      },
    },
    environment: 'node',
    exclude: [...configDefaults.exclude, '.stryker-tmp/**'],
    include: ['test/**/*.test.ts'],
    isolate: true,
    onConsoleLog(): never {
      throw new Error('Logs are forbidden in test suites');
    },
    pool: 'threads',
    reporters: ['dot'],
    sequence: {
      concurrent: false,
      shuffle: true,
    },
    slowTestThreshold: 100,
    testTimeout: 2000,
  },
});
