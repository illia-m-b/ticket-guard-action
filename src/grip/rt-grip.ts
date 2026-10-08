/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

/**
 * Wraps a supplier function in a real-time grip that delegates every invocation
 * dynamically to the underlying origin function without caching.
 *
 * @typeParam T - The return type yielded by the supplier function.
 *
 * @param origin - The supplier function to delegate to.
 *
 * @returns A supplier function that invokes the origin on every call.
 */
export const rtGrip =
  <T>(origin: () => T): (() => T) =>
  () =>
    origin();
