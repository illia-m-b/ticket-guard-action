/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Repository, RpParameters } from './repository.ts';

/**
 * Creates a {@link Repository} backed by plain-text coordinates.
 *
 * Automatically normalizes both the repository owner and repository name to
 * lowercase to guarantee case-insensitive value-object equality.
 *
 * @param parameters - The raw {@link RpParameters} containing owner and
 *   repository name.
 *
 * @returns A {@link Repository} exposing normalized coordinates.
 */
export const rpPlain = ({ owner, repo }: RpParameters): Repository => ({
  name: () => repo.toLowerCase(),
  owner: () => owner.toLowerCase(),
});
