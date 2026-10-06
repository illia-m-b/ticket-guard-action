/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { FakeCheck } from '#check/fk-check.ts';

import { ckChained } from '#check/ck-chained.ts';
import { ckFailed } from '#check/ck-failed.ts';
import { ckOk } from '#check/ck-ok.ts';
import { fkCheck } from '#check/fk-check.ts';

describe('A composite check', { concurrency: true }, () => {
  it('returns a passed check when all checks pass', () => {
    const ok = ckOk();
    const fake = fkCheck();
    const checks = [ok, fake];
    const chained = ckChained(checks);
    const passed = {
      message: ok.message(),
      reason: ok.reason(),
      valid: ok.valid(),
    };
    const result = {
      message: chained.message(),
      reason: chained.reason(),
      valid: chained.valid(),
    };
    assert.deepStrictEqual(
      result,
      passed,
      'The composite check outcome differs from a passed check even though all checks are valid',
    );
  });

  it('returns a passed check when check list is empty', () => {
    const chained = ckChained([]);
    const ok = ckOk();
    const passed = {
      message: ok.message(),
      reason: ok.reason(),
      valid: ok.valid(),
    };
    const result = {
      message: chained.message(),
      reason: chained.reason(),
      valid: chained.valid(),
    };
    assert.deepStrictEqual(
      result,
      passed,
      'An empty composite check did not default to a passed check',
    );
  });

  it('returns the first failing check', () => {
    const failed: FakeCheck = {
      message: 'Happiness for misery I want it',
      reason: 'scope-violation',
      valid: false,
    };
    const fake = fkCheck(failed);
    const checks = [
      ckOk(),
      fake,
      fkCheck(),
      ckFailed('unauthorized', 'This is not what we want'),
    ];
    const chained = ckChained(checks);
    const result = {
      message: chained.message(),
      reason: chained.reason(),
      valid: chained.valid(),
    };
    assert.deepStrictEqual(
      result,
      failed,
      'The composite check did not return the first failing check in the chain',
    );
  });
});
