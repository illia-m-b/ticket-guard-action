/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Grip } from '#grip/grip.ts';

import { stGrip } from '#grip/st-grip.ts';

import type { Check } from './check.ts';

/**
 * Creates a check envelope that delegates the {@link Check} contract to an
 * encapsulated supplier function.
 *
 * @param origin - The supplier function yielding the underlying {@link Check}.
 * @param grip - The {@link Grip} strategy governing evaluation and caching.
 *   Defaults to {@link stGrip}.
 *
 * @returns A {@link Check} forwarding all method calls to the supplied check.
 */
export const ckEnvelope = (
  origin: () => Check,
  grip: Grip<Check> = stGrip,
): Check => {
  const grp = grip(origin);
  return {
    message: () => grp().message(),
    reason: () => grp().reason(),
    valid: () => grp().valid(),
  };
};
