/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { randomInt } from 'node:crypto';
import { describe, it } from 'node:test';

import { rtGrip } from '#grip/rt-grip.ts';

describe('A real-time grip', { concurrency: true }, () => {
  it('does not call the origin function upon initialization', () => {
    let called = 0;
    const never = 0;
    const origin = (): number => {
      called += 1;
      return randomInt(Date.now());
    };
    rtGrip(origin);
    assert.equal(
      called,
      never,
      'A real-time grip eagerly executed the supplier function',
    );
  });

  it('calls the origin function on every invocation', () => {
    let called = 0;
    const times = randomInt(5, 20);
    const isDumb = (): boolean => {
      called += 1;
      return randomInt(0, 2) < 1;
    };
    const grip = rtGrip(isDumb);
    for (let index = 0; index < times; index += 1) {
      grip();
    }
    assert.equal(
      called,
      times,
      'A real-time grip did not delegate every call to the origin function',
    );
  });

  it('yields distinct values produced by the origin across successive calls', () => {
    const grip = rtGrip(() => ({ time: Date.now() }));
    const first = grip();
    const second = grip();
    assert.notEqual(
      first,
      second,
      'A real-time grip yielded the same value across multiple calls',
    );
  });

  it('re-evaluates the origin function when it yields nullish values', () => {
    // eslint-disable-next-line unicorn/no-null
    for (const nullish of [null, undefined]) {
      let called = 0;
      const times = randomInt(3, 15);
      const origin = (): null | undefined => {
        called += 1;
        return nullish;
      };
      const grip = rtGrip(origin);
      for (let index = 0; index < times; index += 1) {
        grip();
      }
      assert.equal(
        called,
        times,
        'A real-time grip did not re-evaluate the origin function when it yielded a nullish value',
      );
    }
  });

  it('propagates errors thrown by the origin function on every invocation', () => {
    const grip = rtGrip((): never => {
      throw new Error('I realized what is wrong with me');
    });
    assert.throws(
      () => grip(),
      {
        message: 'I realized what is wrong with me',
        name: 'Error',
      },
      'A real-time grip silently ignored or modified errors from the origin function',
    );
  });
});
