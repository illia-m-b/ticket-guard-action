/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Inputs } from '#inputs/inputs.ts';
import type { PullRequest } from '#pull-request/pull-request.ts';
import type { Reference } from '#reference/reference.ts';

import { rpReference } from '#repository/rp-reference.ts';

import type { Check } from './check.ts';

import { ckChained } from './ck-chained.ts';
import { ckEnvelope } from './ck-envelope.ts';
import { ckHasReference } from './ck-has-reference.ts';
import { ckScope } from './ck-scope.ts';

/**
 * Creates a composite {@link Check} asserting that a pull request contains a
 * valid ticket reference whose repository complies with configured scope.
 *
 * Sequence:
 *
 * 1. Asserts issue reference presence (fails with `'no-ticket-found'`).
 * 2. Asserts repository scope compliance (fails with `'scope-violation'`).
 *
 * @param inputs - Action configuration inputs.
 * @param pr - The pull request under verification.
 * @param reference - The candidate ticket reference.
 *
 * @returns A {@link Check} representing the candidate reference outcome.
 */
export const ckCandidate = (
  inputs: Inputs,
  pr: PullRequest,
  reference: Reference,
): Check =>
  ckEnvelope(() =>
    ckChained([
      () => ckHasReference(reference),
      () =>
        ckScope(
          inputs.scope(),
          pr.repository(),
          rpReference(reference, pr.repository()),
        ),
    ]),
  );
