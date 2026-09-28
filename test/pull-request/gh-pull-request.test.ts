/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { PRPayload, Repo } from '#pull-request/gh-pull-request.ts';

import { ghPullRequest } from '#pull-request/gh-pull-request.ts';

describe('A GitHub-backed pull request adapter', { concurrency: true }, () => {
  it('projects actual fields', () => {
    const payload: PRPayload = {
      body: 'Closes #12',
      title: 'chore(eslint): integrate unicorn',
      user: { login: 'octocat' },
    };
    const repo: Repo = {
      owner: 'actions',
      repo: 'github',
    };
    const pr = ghPullRequest(payload, repo);
    const actual = {
      author: pr.author(),
      body: pr.body(),
      repoName: pr.repoName(),
      repoOwner: pr.repoOwner(),
      title: pr.title(),
    };
    const expected = {
      author: payload.user?.login,
      body: payload.body,
      repoName: repo.repo,
      repoOwner: repo.owner,
      title: payload.title,
    };
    assert.deepStrictEqual(
      actual,
      expected,
      'Actual PR data was not projected correctly',
    );
  });

  it('handles missing fields', () => {
    const payload: PRPayload = {};
    const repo: Repo = {
      owner: 'pnpm',
      repo: 'pnpm',
    };
    const pr = ghPullRequest(payload, repo);
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
      repoName: repo.repo,
      repoOwner: repo.owner,
      title: '',
    };
    assert.deepStrictEqual(
      actual,
      expected,
      'Undefined PR field must default to empty strings',
    );
  });
});
