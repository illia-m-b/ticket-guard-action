/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Grip } from '#grip/grip.ts';

import { stGrip } from '#grip/st-grip.ts';

import type { Reference } from './reference.ts';

/**
 * Creates a reference envelope that delegates the {@link Reference} contract to
 * an encapsulated supplier function.
 *
 * @param origin - The supplier function yielding the underlying
 *   {@link Reference}.
 * @param grip - The {@link Grip} strategy governing evaluation and caching.
 *   Defaults to {@link stGrip}.
 *
 * @returns A {@link Reference} forwarding all method calls to the supplied
 *   reference.
 */
export const rfEnvelope = (
  origin: () => Reference,
  grip: Grip<Reference> = stGrip,
): Reference => {
  const grp = grip(origin);
  return {
    number: () => grp().number(),
    present: () => grp().present(),
    raw: () => grp().raw(),
  };
};
