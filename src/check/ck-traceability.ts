/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Backlog } from '#backlog/backlog.ts';
import type { Inputs } from '#inputs/inputs.ts';
import type { PullRequest } from '#pull-request/pull-request.ts';
import type { Reference } from '#reference/reference.ts';

import { rfGitHub } from '#reference/rf-git-hub.ts';
import { rfTargets } from '#reference/rf-targets.ts';
import { rpReference } from '#repository/rp-reference.ts';

import type { Traceability } from './traceability.ts';

import { ckCandidate } from './ck-candidate.ts';
import { ckIgnoredActor } from './ck-ignored-actor.ts';
import { ckTicket } from './ck-ticket.ts';
import { trPlain } from './tr-plain.ts';

/**
 * Enforces the complete traceability verification policy against a pull request
 * and its referenced backlog ticket.
 *
 * Sequence:
 *
 * 1. Bypasses verification when pull request author matches ignore-actors.
 * 2. Asserts presence of ticket reference in designated targets.
 * 3. Assert ticket repository scope compliance.
 * 4. Queries backlog tracker for referenced ticket.
 * 5. Asserts ticket existence and policy criteria (lifecycle status, labels,
 *    author assignment).
 *
 * @param inputs - Action configuration inputs.
 * @param pr - The pull request under verification.
 * @param backlog - The ticket repository or tracker client.
 * @param extracted - The reference extractor parsing candidate text. Defaults
 *   to {@link rfGitHub}.
 *
 * @returns A promise resolving to the {@link Traceability} verification outcome.
 */
export const ckTraceability = async (
  inputs: Inputs,
  pr: PullRequest,
  backlog: Backlog,
  extracted: (text: string) => Reference = rfGitHub,
): Promise<Traceability> => {
  const actor = ckIgnoredActor(pr.author(), inputs.ignoreActors());
  if (actor.valid()) {
    return trPlain(actor);
  }
  const reference = rfTargets(inputs.extractFrom(), pr, extracted);
  const candidate = ckCandidate(inputs, pr, reference);
  if (!candidate.valid()) {
    return trPlain(candidate);
  }
  const ticket = await backlog.ticket(
    reference,
    rpReference(reference, pr.repository()),
  );
  return trPlain(ckTicket(inputs, pr, ticket), ticket);
};
