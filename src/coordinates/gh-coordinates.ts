/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Coordinates } from './coordinates.ts';

/**
 * Creates a {@link Coordinates} instance for a GitHub repository.
 *
 * Encapsulates raw coordinate text and validates repository naming rules.
 *
 * @param raw - Candidate coordinate string.
 *
 * @returns A {@link Coordinates} exposing normalized repository coordinates.
 */
export const ghCoordinates = (raw: string): Coordinates => ({
  normalized: () => {
    const trimmed = raw.trim();
    if (
      !/^(?<owner>[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38})\/(?<name>(?!\.{1,2}$)[a-z\d_.-]{1,100})(?<!\.git)$/i.test(
        trimmed,
      )
    ) {
      throw new TypeError(
        `Invalid repository coordinates: expected ("owner/repo"), got "${trimmed}"`,
      );
    }
    return trimmed.toLowerCase();
  },
});
