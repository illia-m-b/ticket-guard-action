/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { silenced } from './silenced.ts';

describe('A silenced stdout execution wrapper', () => {
  it('returns the result yielded by the callback', () => {
    const expected = 42;
    assert.equal(
      silenced(() => expected),
      expected,
      'The wrapped callback result was not returned by the execution wrapper',
    );
  });

  it('restores standard output stream on abnormal termination', () => {
    const original = process.stdout.write.bind(process.stdout);
    try {
      silenced(() => {
        throw new Error('Failure');
      });
    } catch {
      //
    }
    assert.equal(
      process.stdout.write.name,
      original.name,
      'Standard output stream write method was not restored after callback threw an error',
    );
  });
});
