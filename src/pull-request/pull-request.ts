/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

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
   * Retrieves the owner (organization or user) of the target repository.
   *
   * @returns The repository owner.
   */
  readonly owner: () => string;

  /**
   * Retrieves the target repository name.
   *
   * @returns The repository name.
   */
  readonly repository: () => string;

  /**
   * Retrieves the title of the pull request.
   *
   * @returns The pull request title.
   */
  readonly title: () => string;
}
