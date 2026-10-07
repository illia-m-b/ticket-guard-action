/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Reference } from './reference.ts';

/**
 * Creates a reference envelope that delegates the {@link Reference} contract to
 * an encapsulated supplier function.
 *
 * @param origin - The supplier function yielding the underlying
 *   {@link Reference}.
 *
 * @returns A {@link Reference} forwarding all method calls to the supplied
 *   reference.
 */
export const rfEnvelope = (origin: () => Reference): Reference => ({
  number: () => origin().number(),
  present: () => origin().present(),
  raw: () => origin().raw(),
});
