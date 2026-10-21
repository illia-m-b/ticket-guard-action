/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import type { IssuePayload } from '#backlog/github/octokit.ts';

import { fkOctokit } from '#backlog/github/fk-octokit.ts';

describe('an in-memory Octokit client', () => {
  it('throws an error when status is 4xx', async () => {
    const status = 400 + new Date().getDay();
    const octokit = fkOctokit({ status });

    await expect(
      octokit.rest.issues.get({
        issue_number: Date.now(),
        owner: 'googleapis',
        repo: 'release-please-action',
      }),
      'An issue was silently returned despite passing a 4xx status',
    ).rejects.toMatchObject({
      message: `HTTP ${status} from GitHub API`,
      name: 'HttpError',
      status,
    });
  });

  it('projects actual fields', async () => {
    const status = 399 - new Date().getDay();
    const owner = 'google';
    const repository = 'guava';
    const number = Date.now();
    const issue: IssuePayload = {
      assignees: [{ login: 'octocat' }, { login: 'anonymous' }],
      html_url: `https://github.com/${owner}/${repository}/issues/${number}`,
      labels: ['bug', { name: 'question' }],
      number,
      state: 'open',
    };
    const octokit = fkOctokit({ issue, status });
    const actual = await octokit.rest.issues.get({
      issue_number: number,
      owner,
      repo: repository,
    });
    const expected = {
      data: {
        ...issue,
      },
    };

    expect(
      actual,
      'Actual issue fields were not projected correctly',
    ).toStrictEqual(expected);
  });

  it('handles missing fields', async () => {
    const status = 399 - 31 + new Date().getDate();
    const owner = 'pnpm';
    const repository = 'pnpm';
    const number = Date.now();
    const octokit = fkOctokit({ status });
    const actual = await octokit.rest.issues.get({
      issue_number: number,
      owner,
      repo: repository,
    });
    const expected = {
      data: {
        assignees: [],
        html_url: `https://github.com/${owner}/${repository}/issues/${number}`,
        labels: [],
        number,
        state: 'open',
      },
    };

    expect(
      actual,
      'Undefined issue fields were not defaulted to their expected values',
    ).toStrictEqual(expected);
  });
});
