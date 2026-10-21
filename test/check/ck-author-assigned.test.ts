/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { randomInt } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import { ckAuthorAssigned } from '#check/ck-author-assigned.ts';
import { ckFailed } from '#check/ck-failed.ts';
import { ckOk } from '#check/ck-ok.ts';

describe('an author assignment check', () => {
  it('returns a passed check when author is among assignees', () => {
    const assignees = ['OcToCaT', 'pNPM', 'AnoN'];
    const author = (
      assignees[randomInt(assignees.length)] ?? 'pNPM'
    ).toUpperCase();
    const actual = ckAuthorAssigned(author, assignees);
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
      'An author assignment check failed even though the author is among assignees',
    ).toStrictEqual(passed);
  });

  it('returns a failed check when author is not assigned', () => {
    const assignees = ['NiCkNaMe', 'AbbR', 'LoREM'];
    const author =
      (assignees[randomInt(assignees.length)] ?? 'NpM')
        .split('')
        .toReversed()
        .join('') + '-unassigned';
    const actual = ckAuthorAssigned(author, assignees);
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const invalid = ckFailed(
      'author-not-assigned',
      `The author "${author}" is not among assignees. The current list of assignees: ${JSON.stringify(assignees)}`,
    );
    const failed = {
      message: invalid.message(),
      reason: invalid.reason(),
      valid: invalid.valid(),
    };

    expect(
      check,
      'An author assignment check passed even though the author is not assigned',
    ).toStrictEqual(failed);
  });

  it('returns a failed check when the assignees list is empty', () => {
    const assignees: readonly string[] = [];
    const author = 'octocat';
    const actual = ckAuthorAssigned(author, assignees);
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const invalid = ckFailed(
      'author-not-assigned',
      `The author "${author}" is not among assignees. The current list of assignees: ${JSON.stringify(assignees)}`,
    );
    const failed = {
      message: invalid.message(),
      reason: invalid.reason(),
      valid: invalid.valid(),
    };

    expect(
      check,
      'An author assignment check passed even though the assignees list is empty',
    ).toStrictEqual(failed);
  });
});
