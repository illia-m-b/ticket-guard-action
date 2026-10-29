/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Reference } from '#reference/reference.ts';

import type { Check } from './check.ts';

import { ckAssert } from './ck-assert.ts';
import { ckFailed } from './ck-failed.ts';

/**
 * Creates a {@link Check} verifying that an issue reference is present.
 *
 * If the reference is present, validation succeeds with {@link ckOk}. If the
 * reference is absent, validation fails with reason code `'no-ticket-found'`.
 *
 * @param reference - The issue {@link Reference} to evaluate.
 *
 * @returns A {@link Check} representing the reference presence outcome.
 */
export const ckHasReference = (reference: Reference): Check =>
  ckAssert(
    () => reference.present(),
    () =>
      ckFailed(
        'no-ticket-found',
        'No issue reference found in the pull request',
      ),
  );
