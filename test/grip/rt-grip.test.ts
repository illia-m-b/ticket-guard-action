/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { randomInt } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import { rtGrip } from '#grip/rt-grip.ts';

describe('a real-time grip', () => {
  it('does not call the origin function upon initialization', () => {
    let called = 0;
    const never = 0;
    const origin = (): number => {
      called += 1;
      return randomInt(Date.now());
    };
    rtGrip(origin);

    expect(
      called,
      'A real-time grip eagerly executed the supplier function',
    ).toBe(never);
  });

  it('calls the origin function on every invocation', () => {
    let called = 0;
    const times = randomInt(5, 20);
    const isDumb = (): boolean => {
      called += 1;
      return randomInt(0, 2) < 1;
    };
    const isDumbGrp = rtGrip(isDumb);
    for (let index = 0; index < times; index += 1) {
      isDumbGrp();
    }

    expect(
      called,
      'A real-time grip did not delegate every call to the origin function',
    ).toBe(times);
  });

  it('yields distinct values produced by the origin across successive calls', () => {
    const grip = rtGrip(() => ({ time: Date.now() }));
    const first = grip();
    const second = grip();

    expect(
      first,
      'A real-time grip yielded the same value across multiple calls',
    ).not.toBe(second);
  });

  it('re-evaluates the origin function when it yields null', () => {
    let called = 0;
    const times = randomInt(3, 15);
    const origin = (): null => {
      called += 1;
      // eslint-disable-next-line unicorn/no-null
      return null;
    };
    const grip = rtGrip(origin);
    for (let index = 0; index < times; index += 1) {
      grip();
    }

    expect(
      called,
      'A real-time grip did not re-evaluate the origin function when it yielded null',
    ).toBe(times);
  });

  it('re-evaluates the origin function when it yields undefined', () => {
    let called = 0;
    const times = randomInt(3, 15);
    const origin = (): void => {
      called += 1;
    };
    const grip = rtGrip(origin);
    for (let index = 0; index < times; index += 1) {
      grip();
    }

    expect(
      called,
      'A real-time grip did not re-evaluate the origin function when it yielded undefined',
    ).toBe(times);
  });

  it('propagates errors thrown by the origin function on every invocation', () => {
    const grip = rtGrip((): never => {
      throw new Error('I realized what is wrong with me');
    });

    expect(
      () => grip(),
      'A real-time grip silently ignored or modified errors from the origin function',
    ).toThrow(new Error('I realized what is wrong with me'));
  });
});
