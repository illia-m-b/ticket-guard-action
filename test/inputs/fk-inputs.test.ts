/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { FakeInputs } from '#inputs/fk-inputs.ts';

import { fkInputs } from '#inputs/fk-inputs.ts';

describe('An in-memory fake inputs instance', { concurrency: true }, () => {
  it('matches default configuration from action.yml', () => {
    const defaults: FakeInputs = {
      allowedStatuses: ['open'],
      extractFrom: 'pr-title-or-body',
      failOnError: true,
      forbiddenLabels: [],
      gitHubToken: '',
      ignoreActors: ['dependabot[bot]', 'renovate[bot]'],
      requireAllLabels: false,
      requireAuthorAssigned: false,
      requiredLabels: [],
      scope: 'current-repo',
    };
    const fake = fkInputs();
    const actual: FakeInputs = {
      allowedStatuses: fake.allowedStatuses(),
      extractFrom: fake.extractFrom(),
      failOnError: fake.failOnError(),
      forbiddenLabels: fake.forbiddenLabels(),
      gitHubToken: fake.gitHubToken(),
      ignoreActors: fake.ignoreActors(),
      requireAllLabels: fake.requireAllLabels(),
      requireAuthorAssigned: fake.requireAuthorAssigned(),
      requiredLabels: fake.requiredLabels(),
      scope: fake.scope(),
    };
    assert.deepStrictEqual(
      actual,
      defaults,
      'The default input values deviated from the configuration defaults specified in action.yml',
    );
  });

  it('preserves custom configuration overrides', () => {
    const custom: FakeInputs = {
      allowedStatuses: ['closed'],
      extractFrom: 'pr-body',
      failOnError: false,
      forbiddenLabels: ['wontfix'],
      gitHubToken: 'custom-secret-token',
      ignoreActors: ['custom-bot'],
      requireAllLabels: true,
      requireAuthorAssigned: true,
      requiredLabels: ['bug'],
      scope: 'same-org',
    };
    const fake = fkInputs(custom);
    const actual: FakeInputs = {
      allowedStatuses: fake.allowedStatuses(),
      extractFrom: fake.extractFrom(),
      failOnError: fake.failOnError(),
      forbiddenLabels: fake.forbiddenLabels(),
      gitHubToken: fake.gitHubToken(),
      ignoreActors: fake.ignoreActors(),
      requireAllLabels: fake.requireAllLabels(),
      requireAuthorAssigned: fake.requireAuthorAssigned(),
      requiredLabels: fake.requiredLabels(),
      scope: fake.scope(),
    };
    assert.deepStrictEqual(
      actual,
      custom,
      'Custom input overrides were not preserved by the fake inputs instance',
    );
  });
});
