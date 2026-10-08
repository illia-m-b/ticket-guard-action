/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

/**
 * Wraps a supplier function so that it evaluates lazily at most once, caching
 * the result for all subsequent invocations.
 *
 * @param origin - The supplier function to memoize.
 *
 * @returns A memoized supplier function yielding the cached result.
 */
export const sticky = <T>(origin: () => T): (() => T) => {
  const cache: T[] = [];
  return () => {
    if (cache.length === 0) {
      cache.push(origin());
    }
    return cache[0] as T;
  };
};
