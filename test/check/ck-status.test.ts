/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import { ckFailed } from '#check/ck-failed.ts';
import { ckOk } from '#check/ck-ok.ts';
import { ckStatus } from '#check/ck-status.ts';

describe('a status check', () => {
  it('returns a passed check when status is allowed', () => {
    const status = 'open';
    const allowed = [status];
    const actual = ckStatus(status, allowed);
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
      'A status check failed even though the status is allowed',
    ).toStrictEqual(passed);
  });

  it('returns a failed check when status is not allowed', () => {
    const status = 'closed';
    const allowed = ['open'];
    const actual = ckStatus(status, allowed);
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const invalid = ckFailed(
      'status-not-allowed',
      `Status must be one of the following: ${JSON.stringify(allowed)}. Got "${status}" instead.`,
    );
    const failed = {
      message: invalid.message(),
      reason: invalid.reason(),
      valid: invalid.valid(),
    };
    expect(
      check,
      'A status check passed even though the status is not allowed',
    ).toStrictEqual(failed);
  });
});
