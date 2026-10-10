/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ghInputs } from '#inputs/gh-inputs.ts';

import { silenced } from '../silenced/silenced.ts';

describe('A GitHub-backed action inputs adapter', () => {
  it('extracts allowed statuses from environment', () => {
    const expected = ['opened', 'closed', 'in_progress'];
    process.env['INPUT_ALLOWED-STATUSES'] = expected.join('\n');
    assert.deepStrictEqual(
      ghInputs().allowedStatuses(),
      expected,
      'The allowed statuses do not match the configured action input',
    );
  });

  it('extracts ticket target locations from environment', () => {
    const expected = ['pr-body', 'pr-title'];
    process.env['INPUT_EXTRACT-FROM'] = expected.join('\n');
    assert.deepStrictEqual(
      ghInputs().extractFrom(),
      expected,
      'The extraction targets do not match the configured action input',
    );
  });

  it('fails when extraction target is unsupported', () => {
    const invalid = ['pr-body', 'commit-message'];
    process.env['INPUT_EXTRACT-FROM'] = invalid.join('\n');
    assert.throws(
      () => ghInputs().extractFrom(),
      TypeError,
      'An invalid ticket extraction target did not throw a TypeError',
    );
  });

  it('reads fail-on-error flag when enabled', () => {
    process.env['INPUT_FAIL-ON-ERROR'] = 'true';
    assert.equal(
      ghInputs().failOnError(),
      true,
      'The fail-on-error flag was expected to be true',
    );
  });

  it('reads fail-on-error flag when disabled', () => {
    process.env['INPUT_FAIL-ON-ERROR'] = 'false';
    assert.equal(
      ghInputs().failOnError(),
      false,
      'The fail-on-error flag was expected to be false',
    );
  });

  it('extracts forbidden labels from environment', () => {
    const expected = ['do-not-merge', 'blocked', 'stale'];
    process.env['INPUT_FORBIDDEN-LABELS'] = expected.join('\n');
    assert.deepStrictEqual(
      ghInputs().forbiddenLabels(),
      expected,
      'The forbidden labels do not match the configured action input',
    );
  });

  it('reads GitHub token from environment', () => {
    const expected = 'ghp_7xK9mQ2vL8wP4zR1tY6uI0oA3sD5fG8jH';
    process.env['INPUT_GITHUB-TOKEN'] = expected;
    assert.equal(
      silenced(() => ghInputs().gitHubToken()),
      expected,
      'The extracted GitHub token does not match the configured action input',
    );
  });

  it('extracts ignored actors from environment', () => {
    const expected = ['greenkeeper[bot]', 'snyk-bot'];
    process.env['INPUT_IGNORE-ACTORS'] = expected.join('\n');
    assert.deepStrictEqual(
      ghInputs().ignoreActors(),
      expected,
      'The ignored actors do not match the configured action input',
    );
  });

  it('reads require-all-labels flag when enabled', () => {
    process.env['INPUT_REQUIRE-ALL-LABELS'] = 'true';
    assert.equal(
      ghInputs().requireAllLabels(),
      true,
      'The require-all-labels flag was expected to be true',
    );
  });

  it('reads require-all-labels flag when disabled', () => {
    process.env['INPUT_REQUIRE-ALL-LABELS'] = 'false';
    assert.equal(
      ghInputs().requireAllLabels(),
      false,
      'The require-all-labels flag was expected to be false',
    );
  });

  it('reads require-author-assigned flag when enabled', () => {
    process.env['INPUT_REQUIRE-AUTHOR-ASSIGNED'] = 'true';
    assert.equal(
      ghInputs().requireAuthorAssigned(),
      true,
      'The require-author-assigned flag was expected to be true',
    );
  });

  it('reads require-author-assigned flag when disabled', () => {
    process.env['INPUT_REQUIRE-AUTHOR-ASSIGNED'] = 'false';
    assert.equal(
      ghInputs().requireAuthorAssigned(),
      false,
      'The require-author-assigned flag was expected to be false',
    );
  });

  it('extracts required labels from environment', () => {
    const expected = ['bug', 'triage', 'documentation'];
    process.env['INPUT_REQUIRED-LABELS'] = expected.join('\n');
    assert.deepStrictEqual(
      ghInputs().requiredLabels(),
      expected,
      'The required labels do not match the configured action input',
    );
  });

  it('reads repository scope from environment', () => {
    const expected = 'same-org';
    process.env.INPUT_SCOPE = expected;
    assert.equal(
      ghInputs().scope(),
      expected,
      'The repository scope does not match the configured action input',
    );
  });

  it('fails when repository scope is unsupported', () => {
    const invalid = 'cross-enterprise';
    process.env.INPUT_SCOPE = invalid;
    assert.throws(
      () => ghInputs().scope(),
      TypeError,
      'An invalid repository scope did not throw a TypeError',
    );
  });
});
