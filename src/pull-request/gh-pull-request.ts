/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { PullRequest } from '#pull-request/pull-request.ts';

/**
 * Expected schema of the `pull_request` object inside a GitHub webhook payload.
 */
export interface PRPayload {
  readonly body?: null | string;
  readonly title?: string;
  readonly user?: { readonly login?: string };
}

/**
 * Repository coordinates for the target pull request.
 */
export interface Repo {
  readonly owner: string;
  readonly repo: string;
}

/**
 * Creates a {@link PullRequest} adapting a GitHub webhook pull request payload.
 *
 * Assumes the payload is already verified to be a pull request event.
 *
 * @param payload - The pull request payload from the event.
 * @param repo - The owner and repository context.
 *
 * @returns A {@link PullRequest} exposing the pull request metadata.
 */
export const ghPullRequest = (payload: PRPayload, repo: Repo): PullRequest => ({
  author: () => payload.user?.login ?? '',
  body: () => payload.body ?? '',
  repoName: () => repo.repo,
  repoOwner: () => repo.owner,
  title: () => payload.title ?? '',
});
