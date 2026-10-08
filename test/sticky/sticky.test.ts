/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { randomInt } from 'node:crypto';
import { describe, it } from 'node:test';

import { sticky } from '#sticky/sticky.ts';

describe('A sticky wrapper', { concurrency: true }, () => {
  it('does not call the origin function upon initialization', () => {
    let called = 0;
    const never = 0;
    const origin = (): number => {
      called += 1;
      return randomInt(Date.now());
    };
    sticky(origin);
    assert.equal(
      called,
      never,
      'A sticky wrapper eagerly executed the supplier function',
    );
  });

  it('calls the origin function only once', () => {
    let called = 0;
    const once = 1;
    const origin = (): number => {
      called += 1;
      return randomInt(Date.now());
    };
    const wrapped = sticky(origin);
    wrapped();
    wrapped();
    wrapped();
    assert.equal(
      called,
      once,
      'A sticky wrapper evaluated the supplier function more than once',
    );
  });

  it('returns the exact value produced by the origin across successive calls', () => {
    const wrapped = sticky(() => ({
      time: Date.now(),
    }));
    const first = wrapped();
    const second = wrapped();
    assert.equal(
      first,
      second,
      'A sticky wrapper returned different values across multiple calls',
    );
  });

  it('does not re-trigger the origin function when it returns nullish values', () => {
    // eslint-disable-next-line unicorn/no-null
    for (const nullish of [null, undefined]) {
      let called = 0;
      const once = 1;
      const origin = (): null | undefined => {
        called += 1;
        return nullish;
      };
      const wrapped = sticky(origin);
      wrapped();
      wrapped();
      wrapped();
      assert.equal(
        called,
        once,
        'A sticky wrapper did not cache a function that returns a nullish value',
      );
    }
  });

  it('propagates errors thrown by the origin function', () => {
    const wrapped = sticky((): never => {
      throw new Error('I realized what is wrong with me');
    });
    assert.throws(
      () => wrapped(),
      { message: 'I realized what is wrong with me', name: 'Error' },
      'A sticky wrapper silently ignored errors from the origin function or modified them',
    );
  });
});
