/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Ticket } from '#backlog/ticket.ts';
import type { Check } from '#check/check.ts';

import { ckEnvelope } from '#check/ck-envelope.ts';
import { ckFailed } from '#check/ck-failed.ts';
import { ckOk } from '#check/ck-ok.ts';

/**
 * Creates a {@link Check} verifying that a backlog ticket exists.
 *
 * If the ticket exists, validation succeeds with {@link ckOk}. If the ticket is
 * absent, validation fails with reason code `'ticket-not-found'`.
 *
 * @param ticket - The backlog {@link Ticket} to evaluate.
 *
 * @returns A {@link Check} representing the ticket presence outcome.
 */
export const ckPresentTicket = (ticket: Ticket): Check =>
  ckEnvelope(() =>
    ticket.present()
      ? ckOk()
      : ckFailed('ticket-not-found', 'Ticket not found. Check your backlog'),
  );
