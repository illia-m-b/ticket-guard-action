/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ckOk } from '#check/ck-ok.ts';

describe('A passed check', { concurrency: true }, () => {
  it('returns default success message and valid status', () => {
    const check = ckOk();
    const actual = {
      message: check.message(),
      reason: check.reason(),
      valid: check.valid(),
    };
    const expected = {
      message: 'Validation successful',
      reason: 'ok',
      valid: true,
    };
    assert.deepStrictEqual(
      actual,
      expected,
      'A default passed check did not yield the expected successful outcome',
    );
  });

  it('preserves custom message and valid status', () => {
    const message = "It's gonna be OK.";
    const check = ckOk(message);
    const actual = {
      message: check.message(),
      reason: check.reason(),
      valid: check.valid(),
    };
    const expected = {
      message,
      reason: 'ok',
      valid: true,
    };
    assert.deepStrictEqual(
      actual,
      expected,
      'A custom success message was not preserved by the passed check',
    );
  });
});
