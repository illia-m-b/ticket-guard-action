/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ckOk } from '#check/ck-ok.ts';
import { ckWhen } from '#check/ck-when.ts';
import { fkCheck } from '#check/fk-check.ts';

describe('A conditional check', { concurrency: true }, () => {
  it('yields a passed check when the predicate is unmet', () => {
    const actual = ckWhen(false, fkCheck({ valid: false }));
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const ok = ckOk();
    const passed = {
      message: ok.message(),
      reason: ok.reason(),
      valid: ok.valid(),
    };
    assert.deepStrictEqual(
      check,
      passed,
      'A conditional check did not pass when the condition was false',
    );
  });

  it('evaluates the provided check when the predicate is met', () => {
    const fake = fkCheck({
      message: 'Underlying check failed',
      reason: 'forbidden-label',
      valid: false,
    });
    const actual = ckWhen(true, fake);
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const provided = {
      message: fake.message(),
      reason: fake.reason(),
      valid: fake.valid(),
    };
    assert.deepStrictEqual(
      check,
      provided,
      'A conditional check did not evaluate the provided check when the condition was true',
    );
  });
});
