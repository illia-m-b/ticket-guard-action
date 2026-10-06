/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ckEnvelope } from '#check/ck-envelope.ts';
import { fkCheck } from '#check/fk-check.ts';

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
});
