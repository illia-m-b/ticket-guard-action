/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Check } from './check.ts';

import { ckAssert } from './ck-assert.ts';
import { ckFailed } from './ck-failed.ts';

/**
 * Creates a {@link Check} verifying that at least one required label is
 * attached.
 *
 * If any label in the required list is present (or if the required list is
 * empty), validation succeeds with {@link ckOk}. If no required labels are
 * present, validation fails with reason code `'missing-required-label'`.
 *
 * @param labels - The list of actual labels to inspect.
 * @param required - The list of mandatory label names.
 *
 * @returns A {@link Check} representing the required labels validation outcome.
 */
export const ckAnyLabel = (
  labels: readonly string[],
  required: readonly string[],
): Check =>
  ckAssert(
    () =>
      required.length === 0 || labels.some((label) => required.includes(label)),
    () =>
      ckFailed(
        'missing-required-label',
        `Missing required label. At least one of the following labels must be present: ${JSON.stringify(required)}`,
      ),
  );
