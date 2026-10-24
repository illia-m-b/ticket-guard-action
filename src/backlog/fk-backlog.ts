/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Reference } from '#reference/reference.ts';
import type { Repository } from '#repository/repository.ts';

import type { Backlog } from './backlog.ts';
import type { Ticket } from './ticket.ts';

import { fkTicket } from './fk-ticket.ts';

/**
 * Creates an in-memory {@link Backlog} for testing.
 *
 * @param tickets - List of preset tickets to match against references.
 *
 * @returns A test {@link Backlog} implementation.
 */
export const fkBacklog = (tickets: readonly Ticket[]): Backlog => ({
  ticket: async (
    reference: Reference,
    _repository: Repository,
  ): Promise<Ticket> =>
    reference.present()
      ? (tickets.find(
          (ticket) => ticket.present() && ticket.id() === reference.id(),
        ) ?? fkTicket())
      : fkTicket(),
});
