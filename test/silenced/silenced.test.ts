/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { randomInt } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import { silenced } from './silenced.ts';

describe('a silenced stdout execution wrapper', () => {
  it('returns the result yielded by the callback', () => {
    const expected = `value-${randomInt(10, 1000)}`;

    expect(
      silenced(() => expected),
      'The wrapped callback result was not returned by the execution wrapper',
    ).toBe(expected);
  });

  it('restores standard output stream on abnormal termination', () => {
    // eslint-disable-next-line unicorn/consistent-boolean-name
    const original = process.stdout.write.bind(process.stdout);
    try {
      silenced(() => {
        throw new Error('Failure');
      });
    } catch {
      //
    }

    expect(
      process.stdout.write.name,
      'Standard output stream write method was not restored after callback threw an error',
    ).toBe(original.name);
  });
});
