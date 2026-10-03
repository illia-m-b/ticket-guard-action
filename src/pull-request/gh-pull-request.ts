/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { PullRequest } from '#pull-request/pull-request.ts';

/**
 * Minimal subset of the GitHub Actions event context required by
 * {@link ghPullRequest}.
 *
 * Encapsulates the verified pull request event payload and target repository
 * coordinates necessary to instantiate a domain {@link PullRequest}.
 */
export interface PullRequestContext {
  readonly payload: {
    readonly pull_request: {
      readonly body?: null | string;
      readonly title?: string;
      readonly user?: { readonly login?: string };
    };
  };
  readonly repo: {
    readonly owner: string;
    readonly repo: string;
  };
}

/**
 * Creates a {@link PullRequest} adapting a GitHub Actions event context.
 *
 * Precondition: The caller must ensure the workflow event context contains a
 * valid pull request payload (e.g., via event type verification).
 *
 * @param context - The verified pull request event context.
 *
 * @returns A {@link PullRequest} exposing the pull request metadata.
 */
export const ghPullRequest = (context: PullRequestContext): PullRequest => ({
  author: () => context.payload.pull_request.user?.login ?? '',
  body: () => context.payload.pull_request.body ?? '',
  repoName: () => context.repo.repo,
  repoOwner: () => context.repo.owner,
  title: () => context.payload.pull_request.title ?? '',
});
