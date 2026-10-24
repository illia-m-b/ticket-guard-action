/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Ticket } from '#backlog/ticket.ts';

import type { Check } from './check.ts';

/**
 * Represents the outcome of traceability verification, combining the validation
 * {@link Check} with the resolved {@link Ticket}.
 */
export interface Traceability extends Check {
  /**
   * Retrieves the backlog ticket evaluated during traceability verification.
   *
   * @returns The resolved {@link Ticket}, or {@link fkTicket} if verification was
   *   bypassed or no ticket was retrieved.
   */
  readonly ticket: () => Ticket;
}
