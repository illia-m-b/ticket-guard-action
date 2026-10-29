/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

/**
 * Backlog container coordinates identifier.
 */
export interface Coordinates {
  /**
   * Normalized coordinate string.
   *
   * @returns Canonical, lowercased coordinate representation.
   */
  readonly normalized: () => string;
}
