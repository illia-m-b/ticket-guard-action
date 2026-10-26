/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import type { FakePullRequest } from '#pull-request/fk-pull-request.ts';

import { fkPullRequest } from '#pull-request/fk-pull-request.ts';
import { rpPlain } from '#repository/rp-plain.ts';

describe('an in-memory pull request instance', () => {
  it('returns default values', () => {
    const defaults = {
      author: 'octocat',
      body: '',
      owner: 'octo-org',
      repository: 'octo-repo',
      title: 'chore(deps): update devDependencies (non-major)',
    };
    const fake = fkPullRequest();
    const actual = {
      author: fake.author(),
      body: fake.body(),
      owner: fake.repository().owner(),
      repository: fake.repository().name(),
      title: fake.title(),
    };

    expect(actual, 'Unexpected default values were used').toStrictEqual(
      defaults,
    );
  });

  it('preserves custom overrides', () => {
    const custom = {
      author: 'actions',
      body: 'Hello, world!',
      owner: 'actions',
      repository: 'core',
      title: 'Custom PR',
    };
    const parameters: FakePullRequest = {
      author: custom.author,
      body: custom.body,
      repository: rpPlain({ owner: custom.owner, repo: custom.repository }),
      title: custom.title,
    };
    const fake = fkPullRequest(parameters);
    const actual = {
      author: fake.author(),
      body: fake.body(),
      owner: fake.repository().owner(),
      repository: fake.repository().name(),
      title: fake.title(),
    };

    expect(
      actual,
      'Custom overrides were not preserved by the fake PR instance',
    ).toStrictEqual(custom);
  });
});
