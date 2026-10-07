/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Check } from './check.ts';

import { ckEnvelope } from './ck-envelope.ts';
import { ckFailed } from './ck-failed.ts';
import { ckOk } from './ck-ok.ts';

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
  ckEnvelope(() =>
    required.length === 0 || labels.some((label) => required.includes(label))
      ? ckOk()
      : ckFailed(
          'missing-required-label',
          `Missing required label. At least one of the following labels must be present: ${JSON.stringify(required)}`,
        ),
  );
