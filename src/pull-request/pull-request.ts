/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Repository } from '#repository/repository.ts';

/**
 * Represents the Pull Request under evaluation.
 *
 * Exposes accessors for pull request metadata required by traceability and
 * business verification rules.
 */
export interface PullRequest {
  /**
   * Retrieves the GitHub username of the pull request author.
   *
   * @returns The author's username.
   */
  readonly author: () => string;

  /**
   * Retrieves the Markdown description body of the pull request.
   *
   * @returns The pull request description, or an empty string if omitted.
   */
  readonly body: () => string;

  /**
   * Retrieves the target repository coordinates.
   *
   * @returns The repository coordinates {@link Repository}.
   */
  readonly repository: () => Repository;

  /**
   * Retrieves the title of the pull request.
   *
   * @returns The pull request title.
   */
  readonly title: () => string;
}
