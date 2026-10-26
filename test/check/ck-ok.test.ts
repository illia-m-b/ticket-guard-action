/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import { ckOk } from '#check/ck-ok.ts';

describe('a passed check', () => {
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
    expect(
      actual,
      'A default passed check did not yield the expected successful outcome',
    ).toStrictEqual(expected);
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
    expect(
      actual,
      'A custom success message was not preserved by the passed check',
    ).toStrictEqual(expected);
  });
});
