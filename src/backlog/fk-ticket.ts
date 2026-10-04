/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Ticket } from './ticket.ts';

/**
 * Configuration options for creating a fake {@link Ticket} instance.
 */
export type FakeTicket = {
  readonly [K in keyof Ticket]: Ticket[K] extends (
    ..._arguments: never[]
  ) => unknown
    ? ReturnType<Ticket[K]>
    : never;
};

/**
 * Creates an in-memory {@link Ticket} instance for testing.
 *
 * @param initial - Optional partial values to override default ticket fields.
 *
 * @returns A test {@link Ticket} implementation with predetermined values.
 */
export const fkTicket = ({
  assignees = [],
  labels = [],
  number = NaN,
  present = false,
  status = '',
  url = '',
}: Partial<FakeTicket> = {}): Ticket => ({
  assignees: () => assignees,
  labels: () => labels,
  number: (): number => {
    if (!present) {
      throw new TypeError('Ticket is absent');
    }
    return number;
  },
  present: () => present,
  status: () => status,
  url: () => url,
});
