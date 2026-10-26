/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import type { PullRequestContext } from '#pull-request/gh-pull-request.ts';

import { ghPullRequest } from '#pull-request/gh-pull-request.ts';

describe('a GitHub-backed pull request adapter', () => {
  it('projects actual fields', () => {
    const context: PullRequestContext = {
      payload: {
        pull_request: {
          body: 'Closes #12',
          title: 'chore(eslint): integrate unicorn',
          user: { login: 'octocat' },
        },
      },
      repo: {
        owner: 'actions',
        repo: 'github',
      },
    };
    const pr = ghPullRequest(context);
    const actual = {
      author: pr.author(),
      body: pr.body(),
      repoName: pr.repository().name(),
      repoOwner: pr.repository().owner(),
      title: pr.title(),
    };
    const expected = {
      author: context.payload.pull_request.user?.login,
      body: context.payload.pull_request.body,
      repoName: context.repo.repo,
      repoOwner: context.repo.owner,
      title: context.payload.pull_request.title,
    };
    expect(actual, 'Actual PR data was not projected correctly').toStrictEqual(
      expected,
    );
  });

  it('handles missing fields', () => {
    const context: PullRequestContext = {
      payload: { pull_request: {} },
      repo: {
        owner: 'pnpm',
        repo: 'pnpm',
      },
    };
    const pr = ghPullRequest(context);
    const actual = {
      author: pr.author(),
      body: pr.body(),
      repoName: pr.repository().name(),
      repoOwner: pr.repository().owner(),
      title: pr.title(),
    };
    const expected = {
      author: '',
      body: '',
      repoName: context.repo.repo,
      repoOwner: context.repo.owner,
      title: '',
    };
    expect(
      actual,
      'Undefined PR field must default to empty strings',
    ).toStrictEqual(expected);
  });
});
