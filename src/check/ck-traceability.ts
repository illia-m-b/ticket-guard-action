/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

/* eslint-disable unicorn/max-nested-calls */

import type { Ticket } from '#backlog/ticket.ts';
import type { Inputs } from '#inputs/inputs.ts';
import type { PullRequest } from '#pull-request/pull-request.ts';
import type { Reference } from '#reference/reference.ts';

import { rpUrl } from '#repository/rp-url.ts';

import type { Check } from './check.ts';

import { ckAuthorAssigned } from './ck-author-assigned.ts';
import { ckBypassed } from './ck-bypassed.ts';
import { ckChained } from './ck-chained.ts';
import { ckForbiddenLabels } from './ck-forbidden-labels.ts';
import { ckHasReference } from './ck-has-reference.ts';
import { ckPresentTicket } from './ck-present-ticket.ts';
import { ckRequiredLabels } from './ck-required-labels.ts';
import { ckScope } from './ck-scope.ts';
import { ckStatus } from './ck-status.ts';

/**
 * Creates a composite {@link Check} enforcing the complete traceability policy
 * against a pull request and its referenced ticket.
 *
 * Evaluation sequence:
 *
 * 1. Bypasses validation if the pull request author is listed in `ignore-actors`.
 * 2. Asserts issue reference presence (fails with `'no-ticket-found'`).
 * 3. Asserts ticket existence in the tracker (fails with `'ticket-not-found'`).
 * 4. Asserts repository scope compliance (fails with `'scope-violation'`).
 * 5. Asserts allowed lifecycle status if configured (fails with
 *    `'status-not-allowed'`).
 * 6. Asserts mandatory required labels (fails with `'missing-required-label'`).
 * 7. Asserts absence of forbidden labels (fails with `'forbidden-label'`).
 * 8. Asserts author assignment if required (fails with `'author-not-assigned'`).
 *
 * @param inputs - Action configuration inputs.
 * @param pr - The pull request under verification.
 * @param reference - The referenced ticket identifier.
 * @param ticket - The resolved backlog ticket.
 *
 * @returns A {@link Check} representing the traceability outcome.
 */
export const ckTraceability = (
  inputs: Inputs,
  pr: PullRequest,
  reference: Reference,
  ticket: Ticket,
): Check =>
  ckBypassed(
    () => {
      const author = pr.author().toLowerCase();
      return inputs
        .ignoreActors()
        .some((actor) => actor.toLowerCase() === author);
    },
    () =>
      ckChained([
        ckHasReference(reference),
        ckPresentTicket(ticket),
        ckScope(inputs.scope(), pr.repository(), rpUrl(ticket.url())),
        ckBypassed(
          () => inputs.allowedStatuses().length === 0,
          () => ckStatus(ticket.status(), inputs.allowedStatuses()),
        ),
        ckRequiredLabels(
          ticket.labels(),
          inputs.requiredLabels(),
          inputs.requireAllLabels(),
        ),
        ckForbiddenLabels(ticket.labels(), inputs.forbiddenLabels()),
        ckBypassed(
          () => !inputs.requireAuthorAssigned(),
          () => ckAuthorAssigned(pr.author(), ticket.assignees()),
        ),
      ]),
    `Validation bypassed: author "${pr.author()}" is in ignore-actors`,
  );
