/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { FakePullRequest } from '#pull-request/fk-pull-request.ts';

import { fkPullRequest } from '#pull-request/fk-pull-request.ts';

describe('An in-memory pull request instance', { concurrency: true }, () => {
  it('returns default values', () => {
    const defaults: FakePullRequest = {
      author: 'octocat',
      body: '',
      repoName: 'octo-repo',
      repoOwner: 'octo-org',
      title: 'chore(deps): update devDependencies (non-major)',
    };
    const fake = fkPullRequest();
    const actual: FakePullRequest = {
      author: fake.author(),
      body: fake.body(),
      repoName: fake.repoName(),
      repoOwner: fake.repoOwner(),
      title: fake.title(),
    };
    assert.deepStrictEqual(
      actual,
      defaults,
      'Unexpected default values were used',
    );
  });

  it('preserves custom overrides', () => {
    const custom: FakePullRequest = {
      author: 'actions',
      body: 'Hello, world!',
      repoName: 'core',
      repoOwner: 'actions',
      title: 'Custom PR',
    };
    const fake = fkPullRequest(custom);
    const actual: FakePullRequest = {
      author: fake.author(),
      body: fake.body(),
      repoName: fake.repoName(),
      repoOwner: fake.repoOwner(),
      title: fake.title(),
    };
    assert.deepStrictEqual(
      actual,
      custom,
      'Custom overrides were not preserved by the fake PR instance',
    );
  });
});
