/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { PullRequestContext } from '#pull-request/gh-pull-request.ts';

import { ghPullRequest } from '#pull-request/gh-pull-request.ts';

describe('A GitHub-backed pull request adapter', { concurrency: true }, () => {
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
      repoName: pr.repoName(),
      repoOwner: pr.repoOwner(),
      title: pr.title(),
    };
    const expected = {
      author: context.payload.pull_request.user?.login,
      body: context.payload.pull_request.body,
      repoName: context.repo.repo,
      repoOwner: context.repo.owner,
      title: context.payload.pull_request.title,
    };
    assert.deepStrictEqual(
      actual,
      expected,
      'Actual PR data was not projected correctly',
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
      repoName: pr.repoName(),
      repoOwner: pr.repoOwner(),
      title: pr.title(),
    };
    const expected = {
      author: '',
      body: '',
      repoName: context.repo.repo,
      repoOwner: context.repo.owner,
      title: '',
    };
    assert.deepStrictEqual(
      actual,
      expected,
      'Undefined PR field must default to empty strings',
    );
  });
});
