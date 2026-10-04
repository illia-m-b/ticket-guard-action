/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { FakeCheck } from '#check/fk-check.ts';

import { fkCheck } from '#check/fk-check.ts';

describe('An in-memory fake check instance', { concurrency: true }, () => {
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
    assert.deepStrictEqual(
      actual,
      defaults,
      'The default check values deviated from the expected initial successful state',
    );
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
    assert.deepStrictEqual(
      actual,
      custom,
      'Custom overrides were not preserved by the fake check instance',
    );
  });
});
