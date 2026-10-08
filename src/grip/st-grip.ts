/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

/**
 * Wraps a supplier function in a sticky grip that evaluates lazily at most
 * once, caching the resulting value for all subsequent invocations.
 *
 * @typeParam T - The return type yielded by the supplier function.
 *
 * @param origin - The supplier function to memoize.
 *
 * @returns A supplier function yielding the cached result.
 */
export const stGrip = <T>(origin: () => T): (() => T) => {
  const cache: T[] = [];
  return () => {
    if (cache.length === 0) {
      cache.push(origin());
    }
    return cache[0] as T;
  };
};
