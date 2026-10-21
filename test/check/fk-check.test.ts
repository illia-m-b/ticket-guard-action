/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import type { FakeCheck } from '#check/fk-check.ts';

import { fkCheck } from '#check/fk-check.ts';

describe('an in-memory fake check instance', () => {
  it('returns default values', () => {
    const check = fkCheck();
    const actual = {
      message: check.message(),
      reason: check.reason(),
      valid: check.valid(),
    };
    const defaults = {
      message: 'Validation successful',
      reason: 'ok',
      valid: true,
    };

    expect(
      actual,
      'The default check values deviated from the expected initial successful state',
    ).toStrictEqual(defaults);
  });

  it('preserves custom overrides', () => {
    const custom: FakeCheck = {
      message: 'Author is exempt from ticket validation',
      reason: 'ok',
      valid: true,
    };
    const check = fkCheck(custom);
    const actual = {
      message: check.message(),
      reason: check.reason(),
      valid: check.valid(),
    };

    expect(
      actual,
      'Custom overrides were not preserved by the fake check instance',
    ).toStrictEqual(custom);
  });
});
