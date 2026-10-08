/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { randomInt } from 'node:crypto';
import { describe, it } from 'node:test';

import { stGrip } from '#grip/st-grip.ts';

describe('A sticky grip', { concurrency: true }, () => {
  it('does not call the origin function upon initialization', () => {
    let called = 0;
    const never = 0;
    const origin = (): number => {
      called += 1;
      return randomInt(Date.now());
    };
    stGrip(origin);
    assert.equal(
      called,
      never,
      'A sticky grip eagerly executed the supplier function',
    );
  });

  it('calls the origin function only once', () => {
    let called = 0;
    const once = 1;
    const origin = (): number => {
      called += 1;
      return randomInt(Date.now());
    };
    const grip = stGrip(origin);
    grip();
    grip();
    grip();
    assert.equal(
      called,
      once,
      'A sticky grip evaluated the supplier function more than once',
    );
  });

  it('returns the identical value produced by the origin across successive calls', () => {
    const grip = stGrip(() => ({
      time: Date.now(),
    }));
    const first = grip();
    const second = grip();
    assert.equal(
      first,
      second,
      'A sticky grip returned different values across multiple calls',
    );
  });

  it('does not re-evaluate the origin function when it returns nullish values', () => {
    // eslint-disable-next-line unicorn/no-null
    for (const nullish of [null, undefined]) {
      let called = 0;
      const once = 1;
      const origin = (): null | undefined => {
        called += 1;
        return nullish;
      };
      const grip = stGrip(origin);
      grip();
      grip();
      grip();
      assert.equal(
        called,
        once,
        'A sticky grip re-evaluated the origin function when it yielded a nullish value',
      );
    }
  });

  it('propagates errors thrown by the origin function', () => {
    const grip = stGrip((): never => {
      throw new Error('I realized what is wrong with me');
    });
    assert.throws(
      () => grip(),
      { message: 'I realized what is wrong with me', name: 'Error' },
      'A sticky grip silently ignored or modified errors from the origin function',
    );
  });
});
