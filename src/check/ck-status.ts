/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Check } from './check.ts';

import { ckAssert } from './ck-assert.ts';
import { ckFailed } from './ck-failed.ts';

/**
 * Creates a {@link Check} verifying that an issue status is allowed.
 *
 * If the status is present in the allowed list, validation succeeds with
 * {@link ckOk}. If the status is disallowed, validation fails with reason code
 * `'status-not-allowed'`.
 *
 * @param status - The issue status to evaluate.
 * @param allowed - The list of permitted issue statuses.
 *
 * @returns A {@link Check} representing the status validation outcome.
 */
export const ckStatus = (status: string, allowed: readonly string[]): Check =>
  ckAssert(
    () => allowed.includes(status),
    () =>
      ckFailed(
        'status-not-allowed',
        `Status must be one of the following: ${JSON.stringify(allowed)}. Got "${status}" instead.`,
      ),
  );
