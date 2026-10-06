/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Check } from '#check/check.ts';
import type { Reference } from '#reference/reference.ts';

import { ckEnvelope } from '#check/ck-envelope.ts';
import { ckFailed } from '#check/ck-failed.ts';
import { ckOk } from '#check/ck-ok.ts';

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
  ckEnvelope(() =>
    reference.present()
      ? ckOk()
      : ckFailed(
          'no-ticket-found',
          'No issue reference found in the pull request',
        ),
  );
