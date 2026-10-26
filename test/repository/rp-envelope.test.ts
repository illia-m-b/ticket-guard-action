/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import type { RpParameters } from '#repository/repository.ts';

import { rtGrip } from '#grip/rt-grip.ts';
import { rpEnvelope } from '#repository/rp-envelope.ts';
import { rpPlain } from '#repository/rp-plain.ts';

describe('a repository coordinates envelope', () => {
  it('delegates all methods to the encapsulated repository', () => {
    const parameters: RpParameters = { owner: 'OnPm', repo: 'aweSOME' };
    const origin = rpPlain(parameters);
    const envelope = rpEnvelope(() => origin);
    const expected = {
      name: parameters.repo.toLowerCase(),
      owner: parameters.owner.toLowerCase(),
    };
    const delegated = {
      name: envelope.name(),
      owner: envelope.owner(),
    };

    expect(
      delegated,
      'The repo coords envelope returned values that differ from the encapsulated coords',
    ).toStrictEqual(expected);
  });

  it('evaluates the origin function only once across multiple accessors by default', () => {
    let called = 0;
    const once = 1;
    const envelope = rpEnvelope(() => {
      called += 1;
      return rpPlain({ owner: 'googleapis', repo: 'release-please' });
    });
    envelope.owner();
    envelope.name();

    expect(
      called,
      'The repo coords envelope evaluated the origin function more than once under default grip',
    ).toBe(once);
  });

  it('re-evaluates the origin function for each accessor when configured with a real-time grip', () => {
    let called = 0;
    const times = 2;
    const envelope = rpEnvelope(() => {
      called += 1;
      return rpPlain({ owner: 'objectionary', repo: 'eo' });
    }, rtGrip);
    envelope.owner();
    envelope.name();

    expect(
      called,
      'The repo coords envelope did not re-evaluate the origin function for each accessor under real-time grip',
    ).toBe(times);
  });
});
