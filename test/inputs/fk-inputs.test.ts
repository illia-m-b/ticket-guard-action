/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import type { FakeInputs } from '#inputs/fk-inputs.ts';

import { fkInputs } from '#inputs/fk-inputs.ts';

describe('an in-memory fake inputs instance', () => {
  it('matches default configuration from action.yml', () => {
    const defaults: FakeInputs = {
      allowedStatuses: ['open'],
      extractFrom: ['pr-title', 'pr-body'],
      failOnError: true,
      forbiddenLabels: [],
      gitHubToken: '',
      ignoreActors: ['dependabot[bot]', 'renovate[bot]'],
      requireAllLabels: false,
      requireAuthorAssigned: false,
      requiredLabels: [],
      scope: ['octo-org/octo-repo'],
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
    expect(
      actual,
      'The default input values deviated from the configuration defaults specified in action.yml',
    ).toStrictEqual(defaults);
  });

  it('preserves custom configuration overrides', () => {
    const custom: FakeInputs = {
      allowedStatuses: ['closed'],
      extractFrom: ['pr-body'],
      failOnError: false,
      forbiddenLabels: ['wontfix'],
      gitHubToken: 'custom-secret-token',
      ignoreActors: ['custom-bot'],
      requireAllLabels: true,
      requireAuthorAssigned: true,
      requiredLabels: ['bug'],
      scope: ['acme/custom-issues'],
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
    expect(
      actual,
      'Custom input overrides were not preserved by the fake inputs instance',
    ).toStrictEqual(custom);
  });
});
