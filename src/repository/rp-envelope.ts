/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Grip } from '#grip/grip.ts';

import { stGrip } from '#grip/st-grip.ts';

import type { Repository } from './repository.ts';

/**
 * Creates a repository coordinates envelope that delegates the
 * {@link Repository} contract to an encapsulated supplier function.
 *
 * @param origin - The supplier function yielding the underlying
 *   {@link Repository}.
 * @param grip - The {@link Grip} strategy governing evaluation and caching.
 *   Defaults to {@link stGrip}.
 *
 * @returns A {@link Repository} forwarding all method calls to the supplied
 *   repository.
 */
export const rpEnvelope = (
  origin: () => Repository,
  grip: Grip<Repository> = stGrip,
): Repository => {
  const grp = grip(origin);
  return {
    name: () => grp().name(),
    owner: () => grp().owner(),
  };
};
