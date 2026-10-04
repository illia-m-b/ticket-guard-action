/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

/**
 * Minimal subset of the GitHub REST API issue payload required by
 * {@link ghIssue}.
 */
export interface IssuePayload {
  readonly assignees?: null | readonly { readonly login: string }[];
  readonly html_url: string;
  readonly labels: readonly (string | { readonly name?: string })[];
  readonly number: number;
  readonly state: string;
}

/**
 * Minimal structural client contract for fetching issues from GitHub.
 */
export interface Octokit {
  readonly rest: {
    readonly issues: {
      readonly get: (parameters: {
        readonly issue_number: number;
        readonly owner: string;
        readonly repo: string;
      }) => Promise<{ readonly data: IssuePayload }>;
    };
  };
}
