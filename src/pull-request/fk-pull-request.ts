/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { PullRequest } from '#pull-request/pull-request.ts';

/**
 * Configuration options for creating a fake {@link PullRequest} instance.
 */
export type FakePullRequest = {
  readonly [K in keyof PullRequest]: PullRequest[K] extends (
    ..._arguments: never[]
  ) => unknown
    ? ReturnType<PullRequest[K]>
    : never;
};

/**
 * Creates an in-memory {@link PullRequest} instance for testing.
 *
 * @param initial - Optional partial values to override default pull request
 *   fields.
 *
 * @returns A test {@link PullRequest} implementation with predetermined values.
 */
export const fkPullRequest = ({
  author = 'octocat',
  body = '',
  repoName = 'octo-repo',
  repoOwner = 'octo-org',
  title = 'chore(deps): update devDependencies (non-major)',
}: Partial<FakePullRequest> = {}): PullRequest => ({
  author: () => author,
  body: () => body,
  repoName: () => repoName,
  repoOwner: () => repoOwner,
  title: () => title,
});
