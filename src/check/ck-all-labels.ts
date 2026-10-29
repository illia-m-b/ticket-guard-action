/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Check } from './check.ts';

import { ckAssert } from './ck-assert.ts';
import { ckFailed } from './ck-failed.ts';

/**
 * Creates a {@link Check} verifying that all required labels are attached.
 *
 * If every label in the required list is present (or if the required list is
 * empty), validation succeeds with {@link ckOk}. If any required label is
 * missing, validation fails with reason code `'missing-required-label'`.
 *
 * @param labels - The list of actual labels to inspect.
 * @param required - The list of mandatory label names.
 *
 * @returns A {@link Check} representing the required labels validation outcome.
 */
export const ckAllLabels = (
  labels: readonly string[],
  required: readonly string[],
): Check =>
  ckAssert(
    () => required.every((label) => labels.includes(label)),
    () =>
      ckFailed(
        'missing-required-label',
        `Missing required label(s). All of the following are required: ${JSON.stringify(required)}`,
      ),
  );
