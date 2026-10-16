/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Backlog } from '#backlog/backlog.ts';
import type { Inputs } from '#inputs/inputs.ts';
import type { Outputs } from '#outputs/outputs.ts';
import type { PullRequest } from '#pull-request/pull-request.ts';
import type { Reference } from '#reference/reference.ts';

import { ckTraceability } from '#check/ck-traceability.ts';
import { rfGitHub } from '#reference/rf-git-hub.ts';
import { rfTargets } from '#reference/rf-targets.ts';

import type { Action } from './action.ts';

/**
 * Creates an {@link Action} that enforces ticket traceability across pull
 * requests.
 *
 * Scans configured pull request targets for issue references, queries the
 * backlog for the referenced ticket, evaluates the traceability policy rules,
 * and publishes execution outputs and diagnostic messages.
 *
 * @param pr - The pull request under verification.
 * @param inputs - Action configuration inputs.
 * @param backlog - The ticket repository or tracker client.
 * @param outputs - Workflow outputs and diagnostic messaging sink.
 * @param extracted - The reference extractor parsing candidate text. Defaults
 *   to {@link rfGitHub}.
 *
 * @returns An {@link Action} executing the ticket guard verification.
 */
export const ticketGuard = (
  pr: PullRequest,
  inputs: Inputs,
  backlog: Backlog,
  outputs: Outputs,
  extracted: (text: string) => Reference = rfGitHub,
): Action => ({
  run: async () => {
    const reference = rfTargets(inputs.extractFrom(), pr, extracted);
    const ticket = await backlog.ticket(reference);
    const check = ckTraceability(inputs, pr, reference, ticket);
    outputs.output('is-valid', String(check.valid()));
    outputs.output('ticket-id', ticket.present() ? ticket.id() : '');
    outputs.output('ticket-url', ticket.url());
    outputs.output('ticket-status', ticket.status());
    outputs.output('ticket-labels', JSON.stringify(ticket.labels()));
    outputs.output('error-message', check.valid() ? '' : check.reason());
    if (check.valid()) {
      outputs.info(check.message());
      return;
    }
    if (inputs.failOnError()) {
      outputs.fail(check.message());
      return;
    }
    outputs.warn(check.message());
  },
});
