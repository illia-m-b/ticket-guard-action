/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { rfEnvelope } from '#reference/rf-envelope.ts';
import { rfGitHub } from '#reference/rf-git-hub.ts';

describe('A reference envelope', { concurrency: true }, () => {
  it('delegates all methods to the encapsulated reference', () => {
    const origin = rfGitHub(`Closes #${new Date().getDate()}`);
    const envelope = rfEnvelope(() => origin);
    const expected = {
      number: origin.number(),
      present: origin.present(),
      raw: origin.raw(),
    };
    const actual = {
      number: envelope.number(),
      present: envelope.present(),
      raw: envelope.raw(),
    };
    assert.deepStrictEqual(
      actual,
      expected,
      'The reference envelope returned values that differ from the encapsulated reference',
    );
  });
});
