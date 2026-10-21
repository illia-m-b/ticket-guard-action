/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import type { IssuePayload } from '#backlog/github/octokit.ts';

import { ghIssue } from '#backlog/github/gh-issue.ts';

describe('a GitHub issue adapter', () => {
  it('projects actual fields', () => {
    const payload: IssuePayload = {
      assignees: [{ login: 'pnpm' }, { login: 'googleapis' }],
      html_url: 'https://github.com/illia-m-b/veils-js/issues/56',
      labels: ['wontfix', { name: 'bug' }, {}],
      number: 56,
      state: 'open',
    };
    const expected = {
      assignees: ['pnpm', 'googleapis'],
      id: '56',
      labels: ['wontfix', 'bug'],
      present: true,
      status: 'open',
      url: 'https://github.com/illia-m-b/veils-js/issues/56',
    };
    const issue = ghIssue(payload);
    const actual = {
      assignees: issue.assignees(),
      id: issue.id(),
      labels: issue.labels(),
      present: issue.present(),
      status: issue.status(),
      url: issue.url(),
    };

    expect(
      actual,
      'Actual issue fields were not projected correctly',
    ).toStrictEqual(expected);
  });

  it('defaults assignees to an empty array when omitted', () => {
    const payload: IssuePayload = {
      html_url: 'https://github.com/illia-m-b/veils-js/issues/51',
      labels: ['wontfix'],
      number: 51,
      state: 'closed',
    };
    const issue = ghIssue(payload);
    const assignees = issue.assignees();
    const empty: readonly string[] = [];

    expect(
      assignees,
      'Assignees were not defaulted to an empty array when omitted from the payload',
    ).toStrictEqual(empty);
  });
});
