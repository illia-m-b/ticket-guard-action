/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { randomInt } from 'node:crypto';
import { describe, it } from 'node:test';

import { ckFailed } from '#check/ck-failed.ts';
import { ckIgnoredActor } from '#check/ck-ignored-actor.ts';
import { ckOk } from '#check/ck-ok.ts';

void describe('An ignored actor check', { concurrency: true }, () => {
  void it('returns a passed check when author is in ignore-actors', () => {
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
    assert.deepStrictEqual(
      check,
      passed,
      'An ignored actor check failed even though author is in ignore-actors',
    );
  });

  void it('performs case-insensitive matching against ignore-actors', () => {
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
    assert.deepStrictEqual(
      check,
      passed,
      'An ignored actor check failed case-insensitive matching against ignore-actors',
    );
  });

  void it('returns a failed check when author is not in ignore-actors', () => {
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
    assert.deepStrictEqual(
      check,
      failed,
      'An ignored actor check passed even though author is not in ignore-actors',
    );
  });

  void it('returns a failed check when ignore-actors list is empty', () => {
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
    assert.deepStrictEqual(
      check,
      failed,
      'An ignored actor check passed even though ignore-actors list is empty',
    );
  });
});
