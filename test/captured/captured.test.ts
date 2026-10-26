/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { randomInt } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import { captured } from './captured.ts';

describe('a captured stdout execution wrapper', () => {
  it('returns standard output emitted during callback execution', () => {
    const expected = `irregular-${randomInt(10, 1000)}\n`;
    const result = captured(() => {
      process.stdout.write(expected);
    });

    expect(
      result,
      'The standard output stream was not captured by the execution wrapper',
    ).toBe(expected);
  });

  it('restores standard output stream on abnormal termination', () => {
    // eslint-disable-next-line unicorn/consistent-boolean-name
    const original = process.stdout.write.bind(process.stdout);
    try {
      captured(() => {
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
