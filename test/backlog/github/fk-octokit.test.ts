/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { IssuePayload } from '#backlog/github/octokit.ts';

import { fkOctokit } from '#backlog/github/fk-octokit.ts';

describe('An in-memory Octokit client', { concurrency: true }, () => {
  it('throws an error when status is 4xx', async () => {
    const status = 400 + new Date().getDay();
    const octokit = fkOctokit({ status });
    await assert.rejects(
      async () =>
        octokit.rest.issues.get({
          issue_number: Date.now(),
          owner: 'googleapis',
          repo: 'release-please-action',
        }),
      { message: `HTTP ${status} from GitHub API`, name: 'HttpError', status },
      'An issue was silently returned despite passing a 4xx status',
    );
  });

  it('projects actual fields', async () => {
    const status = 399 - new Date().getDay();
    const owner = 'google';
    const repo = 'guava';
    const number = Date.now();
    const issue: IssuePayload = {
      assignees: [{ login: 'octocat' }, { login: 'anonymous' }],
      html_url: `https://github.com/${owner}/${repo}/issues/${number}`,
      labels: ['bug', { name: 'question' }],
      number,
      state: 'open',
    };
    const octokit = fkOctokit({ issue, status });
    const actual = await octokit.rest.issues.get({
      issue_number: number,
      owner,
      repo,
    });
    const expected = {
      data: {
        ...issue,
      },
    };
    assert.deepStrictEqual(
      actual,
      expected,
      'Actual issue fields were not projected correctly',
    );
  });

  it('handles missing fields', async () => {
    const status = 399 - 31 + new Date().getDate();
    const owner = 'pnpm';
    const repo = 'pnpm';
    const number = Date.now();
    const octokit = fkOctokit({ status });
    const actual = await octokit.rest.issues.get({
      issue_number: number,
      owner,
      repo,
    });
    const expected = {
      data: {
        assignees: [],
        html_url: `https://github.com/${owner}/${repo}/issues/${number}`,
        labels: [],
        number,
        state: 'open',
      },
    };
    assert.deepStrictEqual(
      actual,
      expected,
      'Undefined issue fields were not defaulted to their expected values',
    );
  });
});
