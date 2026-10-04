/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { IssuePayload } from '#backlog/github/octokit.ts';

import { ghIssue } from '#backlog/github/gh-issue.ts';

describe('A GitHub issue adapter', { concurrency: true }, () => {
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
      labels: ['wontfix', 'bug'],
      number: 56,
      present: true,
      status: 'open',
      url: 'https://github.com/illia-m-b/veils-js/issues/56',
    };
    const issue = ghIssue(payload);
    const actual = {
      assignees: issue.assignees(),
      labels: issue.labels(),
      number: issue.number(),
      present: issue.present(),
      status: issue.status(),
      url: issue.url(),
    };
    assert.deepStrictEqual(
      actual,
      expected,
      'Actual issue fields were not projected correctly',
    );
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
    assert.deepStrictEqual(
      assignees,
      empty,
      'Assignees were not defaulted to an empty array when omitted from the payload',
    );
  });
});
