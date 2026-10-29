/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Check } from './check.ts';

import { ckOk } from './ck-ok.ts';
import { ckWhen } from './ck-when.ts';

/**
 * Creates a {@link Check} asserting that a condition holds.
 *
 * If the condition is met, validation succeeds with {@link ckOk}. If the
 * condition evaluates to `false`, validation fails with the provided failure
 * check.
 *
 * @param condition - The predicate asserting validation success.
 * @param failure - Supplier evaluated when the assertion fails.
 *
 * @returns A deferred {@link Check}.
 */
export const ckAssert = (
  condition: () => boolean,
  failure: () => Check,
): Check => ckWhen(condition, ckOk, failure);
