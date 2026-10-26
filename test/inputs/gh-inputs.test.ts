/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import { rtGrip } from '#grip/rt-grip.ts';
import { ghInputs } from '#inputs/gh-inputs.ts';

import { silenced } from '../silenced/silenced.ts';

describe('a GitHub-backed action inputs adapter', () => {
  it('extracts allowed statuses from environment', () => {
    const expected = ['opened', 'closed', 'in_progress'];
    process.env['INPUT_ALLOWED-STATUSES'] = expected.join('\n');

    expect(
      ghInputs().allowedStatuses(),
      'The allowed statuses do not match the configured action input',
    ).toStrictEqual(expected);
  });

  it('extracts ticket target locations from environment', () => {
    const expected = ['pr-body', 'pr-title'];
    process.env['INPUT_EXTRACT-FROM'] = expected.join('\n');

    expect(
      ghInputs().extractFrom(),
      'The extraction targets do not match the configured action input',
    ).toStrictEqual(expected);
  });

  it('fails when extraction target is unsupported', () => {
    const invalid = ['pr-body', 'commit-message'];
    process.env['INPUT_EXTRACT-FROM'] = invalid.join('\n');

    expect(
      () => ghInputs().extractFrom(),
      'An invalid ticket extraction target did not throw a TypeError',
    ).toThrow(TypeError);
  });

  it('reads fail-on-error flag when enabled', () => {
    process.env['INPUT_FAIL-ON-ERROR'] = 'true';

    expect(
      ghInputs().failOnError(),
      'The fail-on-error flag was not true',
    ).toBe(true);
  });

  it('reads fail-on-error flag when disabled', () => {
    process.env['INPUT_FAIL-ON-ERROR'] = 'false';

    expect(
      ghInputs().failOnError(),
      'The fail-on-error flag was not false',
    ).toBe(false);
  });

  it('extracts forbidden labels from environment', () => {
    const expected = ['do-not-merge', 'blocked', 'stale'];
    process.env['INPUT_FORBIDDEN-LABELS'] = expected.join('\n');

    expect(
      ghInputs().forbiddenLabels(),
      'The forbidden labels do not match the configured action input',
    ).toStrictEqual(expected);
  });

  it('reads GitHub token from environment', () => {
    const expected = 'ghp_7xK9mQ2vL8wP4zR1tY6uI0oA3sD5fG8jH';
    process.env['INPUT_GITHUB-TOKEN'] = expected;

    expect(
      silenced(() => ghInputs().gitHubToken()),
      'The extracted GitHub token does not match the configured action input',
    ).toBe(expected);
  });

  it('extracts ignored actors from environment', () => {
    const expected = ['greenkeeper[bot]', 'snyk-bot'];
    process.env['INPUT_IGNORE-ACTORS'] = expected.join('\n');

    expect(
      ghInputs().ignoreActors(),
      'The ignored actors do not match the configured action input',
    ).toStrictEqual(expected);
  });

  it('reads require-all-labels flag when enabled', () => {
    process.env['INPUT_REQUIRE-ALL-LABELS'] = 'true';

    expect(
      ghInputs().requireAllLabels(),
      'The require-all-labels flag was not true',
    ).toBe(true);
  });

  it('reads require-all-labels flag when disabled', () => {
    process.env['INPUT_REQUIRE-ALL-LABELS'] = 'false';

    expect(
      ghInputs().requireAllLabels(),
      'The require-all-labels flag was not false',
    ).toBe(false);
  });

  it('reads require-author-assigned flag when enabled', () => {
    process.env['INPUT_REQUIRE-AUTHOR-ASSIGNED'] = 'true';

    expect(
      ghInputs().requireAuthorAssigned(),
      'The require-author-assigned flag was not true',
    ).toBe(true);
  });

  it('reads require-author-assigned flag when disabled', () => {
    process.env['INPUT_REQUIRE-AUTHOR-ASSIGNED'] = 'false';

    expect(
      ghInputs().requireAuthorAssigned(),
      'The require-author-assigned flag was not false',
    ).toBe(false);
  });

  it('extracts required labels from environment', () => {
    const expected = ['bug', 'triage', 'documentation'];
    process.env['INPUT_REQUIRED-LABELS'] = expected.join('\n');

    expect(
      ghInputs().requiredLabels(),
      'The required labels do not match the configured action input',
    ).toStrictEqual(expected);
  });

  it('reads repository scope from environment', () => {
    const expected = 'same-org';
    process.env.INPUT_SCOPE = expected;

    expect(
      ghInputs().scope(),
      'The repository scope does not match the configured action input',
    ).toBe(expected);
  });

  it('fails when repository scope is unsupported', () => {
    const invalid = 'cross-enterprise';
    process.env.INPUT_SCOPE = invalid;

    expect(
      () => ghInputs().scope(),
      'An invalid repository scope did not throw a TypeError',
    ).toThrow(TypeError);
  });

  it('preserves allowed statuses reference identity across repeated calls', () => {
    process.env['INPUT_ALLOWED-STATUSES'] = 'opened\nclosed';
    const inputs = ghInputs();
    const first = inputs.allowedStatuses();
    const second = inputs.allowedStatuses();

    expect(
      first,
      'Allowed statuses array reference changed between subsequent calls',
    ).toBe(second);
  });

  it('preserves memoized value when environment changes after first call', () => {
    process.env['INPUT_ALLOWED-STATUSES'] = 'opened';
    const inputs = ghInputs();
    inputs.allowedStatuses();
    process.env['INPUT_ALLOWED-STATUSES'] = 'closed';

    expect(
      inputs.allowedStatuses(),
      'The allowed statuses were not memoized across environment mutations',
    ).toStrictEqual(['opened']);
  });

  it('re-reads environment values when configured with real-time grip', () => {
    process.env['INPUT_ALLOWED-STATUSES'] = 'opened';
    const inputs = ghInputs(rtGrip);
    inputs.allowedStatuses();
    process.env['INPUT_ALLOWED-STATUSES'] = 'closed';

    expect(
      inputs.allowedStatuses(),
      'The allowed statuses did not reflect environment updates under real-time grip',
    ).toStrictEqual(['closed']);
  });
});
