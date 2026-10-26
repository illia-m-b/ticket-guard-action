/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import type { FakeCheck } from '#check/fk-check.ts';

import { ckChained } from '#check/ck-chained.ts';
import { ckFailed } from '#check/ck-failed.ts';
import { ckOk } from '#check/ck-ok.ts';
import { fkCheck } from '#check/fk-check.ts';

describe('a composite check', () => {
  it('returns a passed check when all checks pass', () => {
    const ok = ckOk();
    const fake = fkCheck();
    const checks = [() => ok, () => fake];
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

    expect(
      result,
      'The composite check outcome differs from a passed check even though all checks are valid',
    ).toStrictEqual(passed);
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

    expect(
      result,
      'An empty composite check did not default to a passed check',
    ).toStrictEqual(passed);
  });

  it('returns the first failing check', () => {
    const failed: FakeCheck = {
      message: 'Happiness for misery I want it',
      reason: 'scope-violation',
      valid: false,
    };
    const fake = fkCheck(failed);
    const checks = [
      () => ckOk(),
      () => fake,
      () => fkCheck(),
      () => ckFailed('unauthorized', 'This is not what we want'),
    ];
    const chained = ckChained(checks);
    const result = {
      message: chained.message(),
      reason: chained.reason(),
      valid: chained.valid(),
    };

    expect(
      result,
      'The composite check did not return the first failing check in the chain',
    ).toStrictEqual(failed);
  });

  it('short-circuits evaluation without invoking downstream suppliers', () => {
    const failed: FakeCheck = {
      message: 'Initial failure',
      reason: 'no-ticket-found',
      valid: false,
    };
    const checks = [
      () => fkCheck(failed),
      () => {
        throw new Error('Downstream supplier must not be evaluated');
      },
    ];
    const chained = ckChained(checks);
    const result = {
      message: chained.message(),
      reason: chained.reason(),
      valid: chained.valid(),
    };

    expect(
      result,
      'The composite check did not short-circuit before invoking downstream suppliers',
    ).toStrictEqual(failed);
  });
});
