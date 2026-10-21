/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { randomInt } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import type { Output } from '#outputs/outputs.ts';

import { fkOutputs } from '#outputs/fk-outputs.ts';

describe('an in-memory fake outputs instance', () => {
  it('records debug messages', () => {
    const debugs: string[] = [];
    const outputs = fkOutputs({ debugs });
    const message = String(Date.now());
    outputs.debug(message);

    expect(
      debugs,
      'A fake outputs instance failed to write the provided debug message to its storage',
    ).toStrictEqual([message]);
  });

  it('records error messages as both strings and Error instances', () => {
    const errors: string[] = [];
    const outputs = fkOutputs({ errors });
    const message = String(Date.now());
    const error = new EvalError(String(new Date().getMilliseconds()));
    outputs.error(message);
    outputs.error(error);

    expect(
      errors,
      'A fake outputs instance failed to populate error storage with both plain strings and messages from Error instances',
    ).toStrictEqual([message, error.message]);
  });

  it('records failure messages as both strings and Error instances', () => {
    const fails: string[] = [];
    const outputs = fkOutputs({ fails });
    const message = String(Date.now());
    const error = new EvalError(String(new Date().getMilliseconds()));
    outputs.fail(message);
    outputs.fail(error);

    expect(
      fails,
      'A fake outputs instance failed to populate failure storage with both plain strings and messages from Error instances',
    ).toStrictEqual([message, error.message]);
  });

  it('records info messages', () => {
    const infos: string[] = [];
    const outputs = fkOutputs({ infos });
    const message = String(Date.now());
    outputs.info(message);

    expect(
      infos,
      'A fake outputs instance failed to write the provided informational message to its storage',
    ).toStrictEqual([message]);
  });

  it('records notice messages as both strings and Error instances', () => {
    const notices: string[] = [];
    const outputs = fkOutputs({ notices });
    const message = String(Date.now());
    const error = new EvalError(String(new Date().getMilliseconds()));
    outputs.notice(message);
    outputs.notice(error);

    expect(
      notices,
      'A fake outputs instance failed to populate notice storage with both plain strings and messages from Error instances',
    ).toStrictEqual([message, error.message]);
  });

  it('records action outputs', () => {
    const storage = new Map<Output, string>();
    const outputs = fkOutputs({ outputs: storage });
    const pairs: readonly [Output, string][] = [
      ['error-message', String(Date.now())],
      ['is-valid', randomInt(0, 10) % 2 === 0 ? 'true' : 'false'],
      [
        'ticket-url',
        `https://github.com/pnpm/pnpm/issues/${randomInt(1000, 10_000)}`,
      ],
    ];
    for (const [name, value] of pairs) {
      outputs.output(name, value);
    }

    expect(
      Object.fromEntries(storage),
      'A fake outputs instance failed to populate output storage with the given entries',
    ).toStrictEqual(Object.fromEntries(pairs));
  });

  it('records warn messages as both strings and Error instances', () => {
    const warns: string[] = [];
    const outputs = fkOutputs({ warns });
    const message = String(Date.now());
    const error = new EvalError(String(new Date().getMilliseconds()));
    outputs.warn(message);
    outputs.warn(error);

    expect(
      warns,
      'A fake outputs instance failed to populate warning storage with both plain strings and messages from Error instances',
    ).toStrictEqual([message, error.message]);
  });
});
