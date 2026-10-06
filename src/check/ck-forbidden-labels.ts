/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Check } from './check.ts';

import { ckEnvelope } from './ck-envelope.ts';
import { ckFailed } from './ck-failed.ts';
import { ckOk } from './ck-ok.ts';

/**
 * Creates a {@link Check} verifying that no forbidden labels are attached.
 *
 * If none of the forbidden labels are present (or if the forbidden list is
 * empty), validation succeeds with {@link ckOk}. If any forbidden label is
 * encountered, validation fails with reason code `'forbidden-label'`.
 *
 * @param labels - The list of actual labels to inspect.
 * @param forbidden - The list of disallowed label names.
 *
 * @returns A {@link Check} representing the forbidden labels outcome.
 */
export const ckForbiddenLabels = (
  labels: readonly string[],
  forbidden: readonly string[],
): Check =>
  ckEnvelope(() =>
    labels.some((label) => forbidden.includes(label))
      ? ckFailed(
          'forbidden-label',
          `Found the banned label(s). Here is a full list of banned ones: ${JSON.stringify(forbidden)}`,
        )
      : ckOk(),
  );
