/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { defineConfig } from 'vitest/config';

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
    onConsoleLog(): never {
      throw new Error('Logs are forbidden in test suites');
    },
    pool: 'threads',
    projects: [
      {
        test: {
          include: [
            'test/inputs/gh-inputs.test.ts',
            'test/outputs/rt-outputs.test.ts',
          ],
          isolate: true,
          name: 'isolated',
          sequence: {
            concurrent: false,
            shuffle: true,
          },
        },
      },
      {
        test: {
          exclude: [
            'test/inputs/gh-inputs.test.ts',
            'test/outputs/rt-outputs.test.ts',
          ],
          include: ['test/**/*.test.ts'],
          isolate: false,
          name: 'unit',
          sequence: {
            concurrent: true,
            shuffle: true,
          },
        },
      },
    ],
    reporters: ['dot'],
    slowTestThreshold: 100,
    testTimeout: 2000,
  },
});
