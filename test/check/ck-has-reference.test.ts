/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ckFailed } from '#check/ck-failed.ts';
import { ckHasReference } from '#check/ck-has-reference.ts';
import { ckOk } from '#check/ck-ok.ts';
import { rfEmpty } from '#reference/rf-empty.ts';
import { rfGitHub } from '#reference/rf-git-hub.ts';

describe('A reference presence check', { concurrency: true }, () => {
  it('returns a passed check when reference is present', () => {
    const present = rfGitHub('Closes #1020');
    const actual = ckHasReference(present);
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
      'A reference presence check failed even though the reference is present',
    );
  });

  it('returns a failed check when reference is absent', () => {
    const absent = rfEmpty();
    const actual = ckHasReference(absent);
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const invalid = ckFailed(
      'no-ticket-found',
      'No issue reference found in the pull request',
    );
    const failed = {
      message: invalid.message(),
      reason: invalid.reason(),
      valid: invalid.valid(),
    };
    assert.deepStrictEqual(
      check,
      failed,
      'A reference presence check passed even though the reference is absent',
    );
  });
});
