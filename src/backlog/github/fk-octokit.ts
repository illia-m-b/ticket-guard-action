/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { IssuePayload, Octokit } from './octokit.ts';

/**
 * In-memory representation of an [Octokit HTTP error][request-error].
 *
 * [request-error]: https://github.com/octokit/request-error.js
 */
export class HttpError extends Error {
  public readonly status: number;

  public constructor(
    status: number,
    message = `HTTP ${status} from GitHub API`,
  ) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

/**
 * @param issue - An optional subset of the GitHub REST API issue payload
 *   required by {@link ghIssue}.
 * @param status - HTTP Response status.
 *
 * @returns An in-memory {@link Octokit} client for testing.
 */
export const fkOctokit = ({
  issue = {},
  status = 200,
}: {
  issue?: Partial<IssuePayload>;
  status?: number;
} = {}): Octokit => ({
  rest: {
    issues: {
      get: async ({ issue_number, owner, repo }) => {
        if (status >= 400) {
          throw new HttpError(status);
        }
        return {
          data: {
            assignees: issue.assignees ?? [],
            html_url:
              issue.html_url ??
              `https://github.com/${owner}/${repo}/issues/${issue_number}`,
            labels: issue.labels ?? [],
            number: issue.number ?? issue_number,
            state: issue.state ?? 'open',
          },
        };
      },
    },
  },
});
