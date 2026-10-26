/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { randomInt } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import { ckAnyLabel } from '#check/ck-any-label.ts';
import { ckFailed } from '#check/ck-failed.ts';
import { ckOk } from '#check/ck-ok.ts';

describe('an any-label check', () => {
  it('returns a passed check when there are no required labels', () => {
    const required: readonly string[] = [];
    const labels = ['wontfix', 'invalid', 'duplicate'];
    const actual = ckAnyLabel(labels, required);
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

    expect(
      check,
      'An any-label check failed even though no labels are required',
    ).toStrictEqual(passed);
  });

  it('returns a passed check when there is at least one required label', () => {
    const required = ['help wanted', 'documentation', 'bug', 'approved'];
    const labels = required.slice(randomInt(1, required.length));
    const actual = ckAnyLabel(labels, required);
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

    expect(
      check,
      'An any-label check failed even though at least one required label is present',
    ).toStrictEqual(passed);
  });

  it('returns a failed check when no required labels are present', () => {
    const required = ['question', 'invalid', 'bug'];
    const labels: readonly string[] = [];
    const actual = ckAnyLabel(labels, required);
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const invalid = ckFailed(
      'missing-required-label',
      `Missing required label. At least one of the following labels must be present: ${JSON.stringify(required)}`,
    );
    const failed = {
      message: invalid.message(),
      reason: invalid.reason(),
      valid: invalid.valid(),
    };

    expect(
      check,
      'An any-label check passed even though no required labels are present',
    ).toStrictEqual(failed);
  });
});
