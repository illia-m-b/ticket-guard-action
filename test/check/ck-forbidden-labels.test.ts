/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { randomInt } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import { ckFailed } from '#check/ck-failed.ts';
import { ckForbiddenLabels } from '#check/ck-forbidden-labels.ts';
import { ckOk } from '#check/ck-ok.ts';

describe('a forbidden labels check', () => {
  it('returns a passed check when there are no forbidden labels', () => {
    const labels = ['bug', 'help wanted'];
    const forbidden = ['wontfix', 'invalid', 'question'];
    const actual = ckForbiddenLabels(labels, forbidden);
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
      'A forbidden labels check failed even though no forbidden labels are present',
    ).toStrictEqual(passed);
  });

  it('returns a passed check when forbidden labels list is empty', () => {
    const labels = ['bug', 'help wanted'];
    const forbidden: readonly string[] = [];
    const actual = ckForbiddenLabels(labels, forbidden);
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
      'A forbidden labels check failed even though the forbidden list is empty',
    ).toStrictEqual(passed);
  });

  it('returns a failed check when a forbidden label is present', () => {
    const labels = ['duplicate', 'bug', 'documentation'];
    const forbidden = [labels[randomInt(labels.length)] ?? 'wontfix'];
    const actual = ckForbiddenLabels(labels, forbidden);
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const invalid = ckFailed(
      'forbidden-label',
      `Found the banned label(s). Here is a full list of banned ones: ${JSON.stringify(forbidden)}`,
    );
    const failed = {
      message: invalid.message(),
      reason: invalid.reason(),
      valid: invalid.valid(),
    };
    expect(
      check,
      'A forbidden labels check passed even though a forbidden label is present',
    ).toStrictEqual(failed);
  });
});
