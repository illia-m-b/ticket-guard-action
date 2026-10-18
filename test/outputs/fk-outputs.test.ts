/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { randomInt } from 'node:crypto';
import { describe, it } from 'node:test';

import type { Output } from '#outputs/outputs.ts';

import { fkOutputs } from '#outputs/fk-outputs.ts';

describe('An in-memory fake outputs instance', { concurrency: true }, () => {
  it('records debug messages', () => {
    const debugs: string[] = [];
    const outputs = fkOutputs({ debugs });
    const message = String(Date.now());
    outputs.debug(message);
    assert.deepStrictEqual(
      debugs,
      [message],
      'A fake outputs instance failed to write the provided debug message to its storage',
    );
  });

  it('records error messages as both strings and Error instances', () => {
    const errors: string[] = [];
    const outputs = fkOutputs({ errors });
    const message = String(Date.now());
    const error = new EvalError(String(new Date().getMilliseconds()));
    outputs.error(message);
    outputs.error(error);
    assert.deepStrictEqual(
      errors,
      [message, error.message],
      'A fake outputs instance failed to populate error storage with both plain strings and messages from Error instances',
    );
  });

  it('records failure messages as both strings and Error instances', () => {
    const fails: string[] = [];
    const outputs = fkOutputs({ fails });
    const message = String(Date.now());
    const error = new EvalError(String(new Date().getMilliseconds()));
    outputs.fail(message);
    outputs.fail(error);
    assert.deepStrictEqual(
      fails,
      [message, error.message],
      'A fake outputs instance failed to populate failure storage with both plain strings and messages from Error instances',
    );
  });

  it('records info messages', () => {
    const infos: string[] = [];
    const outputs = fkOutputs({ infos });
    const message = String(Date.now());
    outputs.info(message);
    assert.deepStrictEqual(
      infos,
      [message],
      'A fake outputs instance failed to write the provided informational message to its storage',
    );
  });

  it('records notice messages as both strings and Error instances', () => {
    const notices: string[] = [];
    const outputs = fkOutputs({ notices });
    const message = String(Date.now());
    const error = new EvalError(String(new Date().getMilliseconds()));
    outputs.notice(message);
    outputs.notice(error);
    assert.deepStrictEqual(
      notices,
      [message, error.message],
      'A fake outputs instance failed to populate notice storage with both plain strings and messages from Error instances',
    );
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
    assert.deepStrictEqual(
      Object.fromEntries(storage),
      Object.fromEntries(pairs),
      'A fake outputs instance failed to populate output storage with the given entries',
    );
  });

  it('records warn messages as both strings and Error instances', () => {
    const warns: string[] = [];
    const outputs = fkOutputs({ warns });
    const message = String(Date.now());
    const error = new EvalError(String(new Date().getMilliseconds()));
    outputs.warn(message);
    outputs.warn(error);
    assert.deepStrictEqual(
      warns,
      [message, error.message],
      'A fake outputs instance failed to populate warning storage with both plain strings and messages from Error instances',
    );
  });
});
