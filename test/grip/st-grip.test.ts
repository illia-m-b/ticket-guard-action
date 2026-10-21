/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { randomInt } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import { stGrip } from '#grip/st-grip.ts';

describe('a sticky grip', () => {
  it('does not call the origin function upon initialization', () => {
    let called = 0;
    const never = 0;
    const origin = (): number => {
      called += 1;
      return randomInt(Date.now());
    };
    stGrip(origin);

    expect(called, 'A sticky grip eagerly executed the supplier function').toBe(
      never,
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

    expect(
      called,
      'A sticky grip evaluated the supplier function more than once',
    ).toBe(once);
  });

  it('returns the identical value produced by the origin across successive calls', () => {
    const grip = stGrip(() => ({
      time: Date.now(),
    }));
    const first = grip();
    const second = grip();

    expect(
      first,
      'A sticky grip returned different values across multiple calls',
    ).toBe(second);
  });

  it('does not re-evaluate the origin function when it returns null', () => {
    let called = 0;
    const once = 1;
    const origin = (): null => {
      called += 1;
      // eslint-disable-next-line unicorn/no-null
      return null;
    };
    const grip = stGrip(origin);
    grip();
    grip();
    grip();

    expect(
      called,
      'A sticky grip re-evaluated the origin function when it yielded null',
    ).toBe(once);
  });

  it('does not re-evaluate the origin function when it returns undefined', () => {
    let called = 0;
    const once = 1;
    const origin = (): void => {
      called += 1;
    };
    const grip = stGrip(origin);
    grip();
    grip();
    grip();

    expect(
      called,
      'A sticky grip re-evaluated the origin function when it yielded undefined',
    ).toBe(once);
  });

  it('propagates errors thrown by the origin function', () => {
    const grip = stGrip((): never => {
      throw new Error('I realized what is wrong with me');
    });

    expect(
      () => grip(),
      'A sticky grip silently ignored or modified errors from the origin function',
    ).toThrow(new Error('I realized what is wrong with me'));
  });
});
