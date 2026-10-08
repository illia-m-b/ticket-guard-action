/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ckEnvelope } from '#check/ck-envelope.ts';
import { fkCheck } from '#check/fk-check.ts';
import { rtGrip } from '#grip/rt-grip.ts';

describe('A check envelope', { concurrency: true }, () => {
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
    assert.deepStrictEqual(
      actual,
      expected,
      'The check envelope returned values that differ from the encapsulated check',
    );
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
    assert.equal(
      called,
      once,
      'The check envelope evaluated the origin function more than once under default grip',
    );
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
    assert.equal(
      called,
      times,
      'The check envelope did not re-evaluate the origin function for each accessor under real-time grip',
    );
  });
});
