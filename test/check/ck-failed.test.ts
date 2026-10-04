/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ckFailed } from '#check/ck-failed.ts';

describe('A failed check', { concurrency: true }, () => {
  it('preserves failure reason, diagnostic message, and invalid status', () => {
    const message = 'Ticket #42 is closed';
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
    assert.deepStrictEqual(
      actual,
      expected,
      'A failed check did not preserve the supplied reason code, message, or invalid status',
    );
  });
});
