/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Check } from './check.ts';

import { ckEnvelope } from './ck-envelope.ts';
import { ckOk } from './ck-ok.ts';

/**
 * Creates a {@link Check} that conditionally delegates between two check
 * suppliers.
 *
 * @param condition - The predicate determining branch execution.
 * @param positive - Supplier evaluated when condition is true.
 * @param negative - Supplier evaluated when condition is false. Defaults to
 *   {@link ckOk}.
 *
 * @returns A deferred {@link Check}.
 */
export const ckWhen = (
  condition: () => boolean,
  positive: () => Check,
  negative: () => Check = ckOk,
): Check => ckEnvelope(() => (condition() ? positive() : negative()));
