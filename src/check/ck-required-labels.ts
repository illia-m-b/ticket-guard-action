/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Check } from './check.ts';

import { ckAllLabels } from './ck-all-labels.ts';
import { ckAnyLabel } from './ck-any-label.ts';
import { ckBypassed } from './ck-bypassed.ts';

/**
 * Creates a {@link Check} verifying that required labels are attached based on
 * the specified strategy.
 *
 * If `required` is empty, validation is bypassed with {@link ckBypassed}. When
 * `requiresAll` is `true`, delegates to {@link ckAllLabels} to ensure every
 * label is present. Otherwise, delegates to {@link ckAnyLabel} to ensure at
 * least one label is present.
 *
 * @param labels - The list of actual labels to inspect.
 * @param required - The list of mandatory label names.
 * @param requiresAll - Whether all required labels must be present (`true`) or
 *   at least one (`false`).
 *
 * @returns A {@link Check} representing the required labels validation outcome.
 */
export const ckRequiredLabels = (
  labels: readonly string[],
  required: readonly string[],
  requiresAll: boolean,
): Check =>
  ckBypassed(
    () => required.length === 0,
    () =>
      requiresAll
        ? ckAllLabels(labels, required)
        : ckAnyLabel(labels, required),
    'Required labels check bypassed as no required labels are specified',
  );
