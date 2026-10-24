/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import { rtGrip } from '#grip/rt-grip.ts';
import { rfEnvelope } from '#reference/rf-envelope.ts';
import { rfGitHub } from '#reference/rf-git-hub.ts';

describe('a reference envelope', () => {
  it('delegates all methods to the encapsulated reference', () => {
    const origin = rfGitHub(`Closes octo/repo#${new Date().getDate()}`);
    const envelope = rfEnvelope(() => origin);
    const expected = {
      id: origin.id(),
      present: origin.present(),
      raw: origin.raw(),
    };
    const actual = {
      id: envelope.id(),
      present: envelope.present(),
      raw: envelope.raw(),
    };

    expect(
      actual,
      'The reference envelope returned values that differ from the encapsulated reference',
    ).toStrictEqual(expected);
  });

  it('evaluates the origin function only once across multiple accessors by default', () => {
    let called = 0;
    const once = 1;
    const envelope = rfEnvelope(() => {
      called += 1;
      return rfGitHub('octo/repo#123');
    });
    envelope.id();
    envelope.present();
    envelope.raw();

    expect(
      called,
      'The reference envelope evaluated the origin function more than once under default grip',
    ).toBe(once);
  });

  it('re-evaluates the origin function for each accessor when configured with a real-time grip', () => {
    let called = 0;
    const times = 3;
    const envelope = rfEnvelope(() => {
      called += 1;
      return rfGitHub('octo/repo#123');
    }, rtGrip);
    envelope.id();
    envelope.present();
    envelope.raw();

    expect(
      called,
      'The reference envelope did not re-evaluate the origin function for each accessor under real-time grip',
    ).toBe(times);
  });
});
