/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { dumb } from '../src/index.ts';

void describe('Temporary function', (): void => {
  void it('greets the world', (): void => {
    assert.equal(
      dumb(),
      'Hello, world!',
      'A different string than "Hello, world!" was returned by the temporarily implemented function.',
    );
  });
});
