/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ckBypassed } from '#check/ck-bypassed.ts';
import { ckOk } from '#check/ck-ok.ts';
import { fkCheck } from '#check/fk-check.ts';

describe('A bypassed check', { concurrency: true }, () => {
  it('short-circuits immediately with a passed check and default message when bypass predicate is true', () => {
    const actual = ckBypassed(true, fkCheck({ valid: false }));
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const ok = ckOk('Validation bypassed');
    const passed = {
      message: ok.message(),
      reason: ok.reason(),
      valid: ok.valid(),
    };
    assert.deepStrictEqual(
      check,
      passed,
      'A bypassed check did not produce a passed check with default message when predicate was true',
    );
  });

  it('short-circuits immediately with a passed check and custom message when bypass predicate is true', () => {
    const message = String(Date.now());
    const actual = ckBypassed(true, fkCheck({ valid: false }), message);
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const ok = ckOk(message);
    const passed = {
      message: ok.message(),
      reason: ok.reason(),
      valid: ok.valid(),
    };
    assert.deepStrictEqual(
      check,
      passed,
      'A bypassed check did not produce a passed check with custom message when predicate was true',
    );
  });

  it('delegates to the wrapped check when bypass predicate is false', () => {
    const fake = fkCheck({ valid: false });
    const delegated = {
      message: fake.message(),
      reason: fake.reason(),
      valid: fake.valid(),
    };
    const actual = ckBypassed(false, fake);
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    assert.deepStrictEqual(
      check,
      delegated,
      'The wrapped check was unexpectedly bypassed when predicate was false',
    );
  });
});
