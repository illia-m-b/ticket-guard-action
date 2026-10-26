/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import { ckFailed } from '#check/ck-failed.ts';

describe('a failed check', () => {
  it('preserves failure reason, diagnostic message, and invalid status', () => {
    const message = 'Ticket #592 is closed';
    const reason = 'status-not-allowed';
    const check = ckFailed(reason, message);
    const actual = {
      message: check.message(),
      reason: check.reason(),
      valid: check.valid(),
    };
    const expected = {
      message,
      reason,
      valid: false,
    };
    expect(
      actual,
      'A failed check did not preserve the supplied reason code, message, or invalid status',
    ).toStrictEqual(expected);
  });
});
