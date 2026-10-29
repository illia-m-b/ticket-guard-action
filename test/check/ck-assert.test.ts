/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import { ckAssert } from '#check/ck-assert.ts';
import { ckFailed } from '#check/ck-failed.ts';

describe('an assertion check', () => {
  it('succeeds when condition is true', () => {
    const actual = ckAssert(
      () => true,
      () => ckFailed('scope-violation', 'Should not fail: §_delta-7'),
    );
    expect(
      actual.valid(),
      'An assertion check failed when condition is true',
    ).toBe(true);
  });

  it('fails with provided failure check when condition is false', () => {
    const failure = ckFailed('ticket-not-found', 'Ticket missing: ‰_zeta-9');
    const actual = ckAssert(
      () => false,
      () => failure,
    );
    expect(
      actual.message(),
      'An assertion check did not return failure message when condition is false',
    ).toBe(failure.message());
  });

  it('defers condition evaluation until checked', () => {
    let queried = false;
    ckAssert(
      () => {
        queried = true;
        return true;
      },
      () => ckFailed('status-not-allowed', 'Error'),
    );
    expect(
      queried,
      'An assertion check evaluated condition eagerly upon instantiation',
    ).toBe(false);
  });
});
