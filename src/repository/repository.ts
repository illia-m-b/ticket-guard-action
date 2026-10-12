/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

/**
 * Represents repository coordinates.
 */
export interface Repository {
  /**
   * Retrieves the repository name.
   *
   * @returns The repository name.
   */
  readonly name: () => string;

  /**
   * Retrieves the repository owner (organization or user).
   *
   * @returns The repository owner.
   */
  readonly owner: () => string;
}

/**
 * Raw parameters required to construct a {@link Repository}.
 *
 * Structurally compatible with the GitHub Actions runner context repository
 * coordinates (`context.repo`).
 */
export interface RpParameters {
  /**
   * The repository owner (organization or user account).
   */
  readonly owner: string;

  /**
   * The repository name.
   */
  readonly repo: string;
}
