/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import { ckFailed } from '#check/ck-failed.ts';
import { ckOk } from '#check/ck-ok.ts';
import { ckWhen } from '#check/ck-when.ts';

describe('a conditional check', () => {
  it('delegates to positive check when condition is true', () => {
    const positive = ckOk('Condition met: §_alpha');
    const actual = ckWhen(
      () => true,
      () => positive,
      () => ckFailed('scope-violation', 'Negative branch error'),
    );
    expect(
      actual.message(),
      'A conditional check did not delegate to positive check when true',
    ).toBe(positive.message());
  });

  it('delegates to negative check when condition is false', () => {
    const negative = ckFailed('author-not-assigned', 'Negative branch: ‰_beta');
    const actual = ckWhen(
      () => false,
      () => ckOk('Positive branch error'),
      () => negative,
    );
    expect(
      actual.message(),
      'A conditional check did not delegate to negative check when false',
    ).toBe(negative.message());
  });

  it('delegates reason code to underlying check', () => {
    const failed = ckFailed('scope-violation', 'Scope error: ¶_gamma');
    const actual = ckWhen(
      () => false,
      () => ckOk(),
      () => failed,
    );
    expect(
      actual.reason(),
      'A conditional check did not delegate reason code to underlying check',
    ).toBe(failed.reason());
  });

  it('defaults to successful check when condition is false and negative check is omitted', () => {
    const actual = ckWhen(
      () => false,
      () => ckFailed('status-not-allowed', 'Positive error'),
    );
    expect(
      actual.valid(),
      'A conditional check did not default to valid check when condition is false and negative check is omitted',
    ).toBe(true);
  });

  it('defers condition evaluation until validity is queried', () => {
    let queried = false;
    ckWhen(
      () => {
        queried = true;
        return true;
      },
      () => ckOk('Executed'),
    );
    expect(
      queried,
      'A conditional check evaluated condition eagerly upon instantiation',
    ).toBe(false);
  });
});
