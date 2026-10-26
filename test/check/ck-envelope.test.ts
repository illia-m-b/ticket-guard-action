/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import { ckEnvelope } from '#check/ck-envelope.ts';
import { fkCheck } from '#check/fk-check.ts';
import { rtGrip } from '#grip/rt-grip.ts';

describe('a check envelope', () => {
  it('delegates all methods to the encapsulated check', () => {
    const origin = fkCheck();
    const envelope = ckEnvelope(() => origin);
    const expected = {
      message: origin.message(),
      reason: origin.reason(),
      valid: origin.valid(),
    };
    const actual = {
      message: envelope.message(),
      reason: envelope.reason(),
      valid: envelope.valid(),
    };

    expect(
      actual,
      'The check envelope returned values that differ from the encapsulated check',
    ).toStrictEqual(expected);
  });

  it('evaluates the origin function only once across multiple accessors by default', () => {
    let called = 0;
    const once = 1;
    const envelope = ckEnvelope(() => {
      called += 1;
      return fkCheck();
    });
    envelope.valid();
    envelope.reason();
    envelope.message();

    expect(
      called,
      'The check envelope evaluated the origin function more than once under default grip',
    ).toBe(once);
  });

  it('re-evaluates the origin function for each accessor when configured with a real-time grip', () => {
    let called = 0;
    const times = 3;
    const envelope = ckEnvelope(() => {
      called += 1;
      return fkCheck();
    }, rtGrip);
    envelope.valid();
    envelope.reason();
    envelope.message();

    expect(
      called,
      'The check envelope did not re-evaluate the origin function for each accessor under real-time grip',
    ).toBe(times);
  });
});
