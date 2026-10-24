/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Traceability } from '#check/traceability.ts';
import type { Inputs } from '#inputs/inputs.ts';
import type { Outputs } from '#outputs/outputs.ts';

import type { Action } from './action.ts';

/**
 * Creates an {@link Action} that enforces ticket traceability across pull
 * requests.
 *
 * Evaluates the supplied traceability check and publishes workflow outputs and
 * diagnostic log messages.
 *
 * @param trace - The deferred traceability verification thunk.
 * @param outputs - Workflow outputs and diagnostic messaging sink.
 * @param inputs - Action configuration inputs.
 *
 * @returns An {@link Action} executing the ticket guard verification.
 */
export const ticketGuard = (
  trace: () => Promise<Traceability>,
  outputs: Outputs,
  inputs: Inputs,
): Action => ({
  run: async () => {
    const result = await trace();
    const ticket = result.ticket();
    outputs.output('is-valid', String(result.valid()));
    outputs.output('ticket-id', ticket.present() ? ticket.id() : '');
    outputs.output('ticket-url', ticket.url());
    outputs.output('ticket-status', ticket.status());
    outputs.output('ticket-labels', JSON.stringify(ticket.labels()));
    outputs.output('error-message', result.valid() ? '' : result.reason());
    if (result.valid()) {
      outputs.info(result.message());
      return;
    }
    if (inputs.failOnError()) {
      outputs.fail(result.message());
      return;
    }
    outputs.warn(result.message());
  },
});
