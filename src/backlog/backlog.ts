/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Reference } from '#reference/reference.ts';

import type { Ticket } from './ticket.ts';

/**
 * Represents a collection or repository of tickets in a backlog.
 */
export interface Backlog {
  /**
   * Retrieves a {@link Ticket} matching the specified ticket reference.
   *
   * @param reference - The ticket reference to look up.
   *
   * @returns A promise resolving to the corresponding {@link Ticket}.
   */
  readonly ticket: (reference: Reference) => Promise<Ticket>;
}
