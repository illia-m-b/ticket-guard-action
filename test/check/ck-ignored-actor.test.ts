/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { randomInt } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import { ckFailed } from '#check/ck-failed.ts';
import { ckIgnoredActor } from '#check/ck-ignored-actor.ts';
import { ckOk } from '#check/ck-ok.ts';

describe('an ignored actor check', () => {
  it('returns a passed check when author is in ignore-actors', () => {
    const actors = ['dependabot[bot]', 'renovate[bot]', 'github-actions[bot]'];
    const author = actors[randomInt(actors.length)] ?? 'renovate[bot]';
    const actual = ckIgnoredActor(author, actors);
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const ok = ckOk(
      `Validation bypassed: author "${author}" is in ignore-actors`,
    );
    const passed = {
      message: ok.message(),
      reason: ok.reason(),
      valid: ok.valid(),
    };

    expect(
      check,
      'An ignored actor check failed even though author is in ignore-actors',
    ).toStrictEqual(passed);
  });

  it('performs case-insensitive matching against ignore-actors', () => {
    const actors = ['dependaBOT[bot]', 'renoVATE[BOT]'];
    const author = 'RENOvate[bot]';
    const actual = ckIgnoredActor(author, actors);
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const ok = ckOk(
      `Validation bypassed: author "${author}" is in ignore-actors`,
    );
    const passed = {
      message: ok.message(),
      reason: ok.reason(),
      valid: ok.valid(),
    };

    expect(
      check,
      'An ignored actor check failed case-insensitive matching against ignore-actors',
    ).toStrictEqual(passed);
  });

  it('returns a failed check when author is not in ignore-actors', () => {
    const actors = ['dependabot[bot]', 'renovate[bot]'];
    const author = 'octocat';
    const actual = ckIgnoredActor(author, actors);
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const invalid = ckFailed(
      'ok',
      `Author "${author}" is not in ignore-actors`,
    );
    const failed = {
      message: invalid.message(),
      reason: invalid.reason(),
      valid: invalid.valid(),
    };

    expect(
      check,
      'An ignored actor check passed even though author is not in ignore-actors',
    ).toStrictEqual(failed);
  });

  it('returns a failed check when ignore-actors list is empty', () => {
    const actors: readonly string[] = [];
    const author = 'renovate[bot]';
    const actual = ckIgnoredActor(author, actors);
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const invalid = ckFailed(
      'ok',
      `Author "${author}" is not in ignore-actors`,
    );
    const failed = {
      message: invalid.message(),
      reason: invalid.reason(),
      valid: invalid.valid(),
    };

    expect(
      check,
      'An ignored actor check passed even though ignore-actors list is empty',
    ).toStrictEqual(failed);
  });
});
