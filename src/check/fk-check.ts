/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Check } from './check.ts';

/**
 * Configuration options for creating a fake {@link Check} instance.
 */
export type FakeCheck = {
  readonly [K in keyof Check]: Check[K] extends (
    ..._arguments: never[]
  ) => unknown
    ? ReturnType<Check[K]>
    : never;
};

/**
 * Creates an in-memory {@link Check} instance for testing.
 *
 * @param initial - Optional partial values to override default check fields.
 *
 * @returns A test {@link Check} implementation with predetermined values.
 */
export const fkCheck = ({
  message = 'Validation successful',
  reason = 'ok',
  valid = true,
}: Partial<FakeCheck> = {}): Check => ({
  message: () => message,
  reason: () => reason,
  valid: () => valid,
});
