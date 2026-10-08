/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { rtGrip } from '#grip/rt-grip.ts';
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

  it('evaluates the origin function only once across multiple accessors by default', () => {
    let called = 0;
    const once = 1;
    const envelope = rfEnvelope(() => {
      called += 1;
      return rfGitHub('#123');
    });
    envelope.number();
    envelope.present();
    envelope.raw();
    assert.equal(
      called,
      once,
      'The reference envelope evaluated the origin function more than once under default grip',
    );
  });

  it('re-evaluates the origin function for each accessor when configured with a real-time grip', () => {
    let called = 0;
    const times = 3;
    const envelope = rfEnvelope(() => {
      called += 1;
      return rfGitHub('#123');
    }, rtGrip);
    envelope.number();
    envelope.present();
    envelope.raw();
    assert.equal(
      called,
      times,
      'The reference envelope did not re-evaluate the origin function for each accessor under real-time grip',
    );
  });
});
