/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Ticket } from '#backlog/ticket.ts';

import { fkTicket } from '#backlog/fk-ticket.ts';

import type { Check } from './check.ts';
import type { Traceability } from './traceability.ts';

/**
 * Creates a plain {@link Traceability} outcome binding a {@link Check} to an
 * optional {@link Ticket}.
 *
 * @param check - The underlying check outcome.
 * @param ticket - The resolved ticket. Defaults to {@link fkTicket}.
 *
 * @returns An immutable {@link Traceability} instance.
 */
export const trPlain = (
  check: Check,
  ticket: Ticket = fkTicket(),
): Traceability => ({
  message: () => check.message(),
  reason: () => check.reason(),
  ticket: () => ticket,
  valid: () => check.valid(),
});
