/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { rpPlain } from '#repository/rp-plain.ts';

import type { PullRequest } from './pull-request.ts';

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
  repository = rpPlain({ owner: 'octo-org', repo: 'octo-repo' }),
  title = 'chore(deps): update devDependencies (non-major)',
}: Partial<FakePullRequest> = {}): PullRequest => ({
  author: () => author,
  body: () => body,
  repository: () => repository,
  title: () => title,
});
