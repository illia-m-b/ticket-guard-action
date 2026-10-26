/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Reference } from './reference.ts';

/**
 * Creates an empty issue reference representing an absent ticket.
 *
 * @returns A {@link Reference} whose presence is false.
 */
export const rfEmpty = (): Reference => ({
  id: (): never => {
    throw new TypeError('Reference is empty');
  },
  present: () => false,
  raw: () => '',
});
