/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { randomInt } from 'node:crypto';
import { describe, it } from 'node:test';

import { captured } from './captured.ts';

void describe('A captured stdout execution wrapper', () => {
  void it('returns standard output emitted during callback execution', () => {
    const expected = `irregular-${randomInt(10, 1000)}\n`;
    const result = captured(() => {
      process.stdout.write(expected);
    });
    assert.equal(
      result,
      expected,
      'The standard output stream was not captured by the execution wrapper',
    );
  });

  void it('restores standard output stream on abnormal termination', () => {
    // eslint-disable-next-line unicorn/consistent-boolean-name
    const original = process.stdout.write.bind(process.stdout);
    try {
      captured(() => {
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
