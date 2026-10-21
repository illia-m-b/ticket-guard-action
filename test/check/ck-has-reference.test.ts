/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import { ckFailed } from '#check/ck-failed.ts';
import { ckHasReference } from '#check/ck-has-reference.ts';
import { ckOk } from '#check/ck-ok.ts';
import { rfEmpty } from '#reference/rf-empty.ts';
import { rfGitHub } from '#reference/rf-git-hub.ts';

describe('a reference presence check', () => {
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

    expect(
      check,
      'A reference presence check failed even though the reference is present',
    ).toStrictEqual(passed);
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

    expect(
      check,
      'A reference presence check passed even though the reference is absent',
    ).toStrictEqual(failed);
  });
});
