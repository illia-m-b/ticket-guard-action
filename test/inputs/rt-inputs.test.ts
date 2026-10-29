/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import { rtGrip } from '#grip/rt-grip.ts';
import { stGrip } from '#grip/st-grip.ts';
import { rtInputs } from '#inputs/rt-inputs.ts';

import { silenced } from '../silenced/silenced.ts';

describe('a real-time action inputs adapter', () => {
  it('extracts allowed statuses from environment', () => {
    const expected = ['opened', 'closed', 'in_progress'];
    process.env['INPUT_ALLOWED-STATUSES'] = expected.join('\n');
    expect(
      rtInputs().allowedStatuses(),
      'The allowed statuses do not match the configured action input',
    ).toStrictEqual(expected);
  });

  it('extracts ticket target locations from environment', () => {
    const expected = ['pr-body', 'pr-title'];
    process.env['INPUT_EXTRACT-FROM'] = expected.join('\n');
    expect(
      rtInputs().extractFrom(),
      'The extraction targets do not match the configured action input',
    ).toStrictEqual(expected);
  });

  it('fails when extraction target is unsupported', () => {
    const invalid = ['pr-body', 'commit-message'];
    process.env['INPUT_EXTRACT-FROM'] = invalid.join('\n');
    expect(
      () => rtInputs().extractFrom(),
      'An invalid ticket extraction target did not throw a TypeError',
    ).toThrow(TypeError);
  });

  it('reads fail-on-error flag when enabled', () => {
    process.env['INPUT_FAIL-ON-ERROR'] = 'true';
    expect(
      rtInputs().failOnError(),
      'The fail-on-error flag was not true',
    ).toBe(true);
  });

  it('reads fail-on-error flag when disabled', () => {
    process.env['INPUT_FAIL-ON-ERROR'] = 'false';
    expect(
      rtInputs().failOnError(),
      'The fail-on-error flag was not false',
    ).toBe(false);
  });

  it('extracts forbidden labels from environment', () => {
    const expected = ['do-not-merge', 'blocked', 'stale'];
    process.env['INPUT_FORBIDDEN-LABELS'] = expected.join('\n');
    expect(
      rtInputs().forbiddenLabels(),
      'The forbidden labels do not match the configured action input',
    ).toStrictEqual(expected);
  });

  it('reads GitHub token from environment', () => {
    const expected = 'ghp_7xK9mQ2vL8wP4zR1tY6uI0oA3sD5fG8jH';
    process.env['INPUT_GITHUB-TOKEN'] = expected;
    expect(
      silenced(() => rtInputs().gitHubToken()),
      'The extracted GitHub token does not match the configured action input',
    ).toBe(expected);
  });

  it('extracts ignored actors from environment', () => {
    const expected = ['greenkeeper[bot]', 'snyk-bot'];
    process.env['INPUT_IGNORE-ACTORS'] = expected.join('\n');
    expect(
      rtInputs().ignoreActors(),
      'The ignored actors do not match the configured action input',
    ).toStrictEqual(expected);
  });

  it('reads require-all-labels flag when enabled', () => {
    process.env['INPUT_REQUIRE-ALL-LABELS'] = 'true';
    expect(
      rtInputs().requireAllLabels(),
      'The require-all-labels flag was not true',
    ).toBe(true);
  });

  it('reads require-all-labels flag when disabled', () => {
    process.env['INPUT_REQUIRE-ALL-LABELS'] = 'false';
    expect(
      rtInputs().requireAllLabels(),
      'The require-all-labels flag was not false',
    ).toBe(false);
  });

  it('reads require-author-assigned flag when enabled', () => {
    process.env['INPUT_REQUIRE-AUTHOR-ASSIGNED'] = 'true';
    expect(
      rtInputs().requireAuthorAssigned(),
      'The require-author-assigned flag was not true',
    ).toBe(true);
  });

  it('reads require-author-assigned flag when disabled', () => {
    process.env['INPUT_REQUIRE-AUTHOR-ASSIGNED'] = 'false';
    expect(
      rtInputs().requireAuthorAssigned(),
      'The require-author-assigned flag was not false',
    ).toBe(false);
  });

  it('extracts required labels from environment', () => {
    const expected = ['bug', 'triage', 'documentation'];
    process.env['INPUT_REQUIRED-LABELS'] = expected.join('\n');
    expect(
      rtInputs().requiredLabels(),
      'The required labels do not match the configured action input',
    ).toStrictEqual(expected);
  });

  it('extracts normalized repository scope from environment', () => {
    process.env.INPUT_SCOPE = ' Octocat/Hello-World \n ACME/Backlog \n';
    expect(
      rtInputs().scope(),
      'The repository scope was not normalized to trimmed lowercase strings',
    ).toStrictEqual(['octocat/hello-world', 'acme/backlog']);
  });

  it('fails when repository scope is empty', () => {
    process.env.INPUT_SCOPE = '   \n \t \n';
    expect(
      () => rtInputs().scope(),
      'An empty repository scope did not throw a TypeError',
    ).toThrow(
      new TypeError(
        'Invalid "scope": at least one repository must be specified',
      ),
    );
  });

  it('fails when repository coordinate in scope is malformed', () => {
    process.env.INPUT_SCOPE = 'octocat/hello-world.git';
    expect(
      () => rtInputs().scope(),
      'A malformed repository coordinate in scope did not throw a TypeError',
    ).toThrow(
      new TypeError(
        'Invalid "scope": expected repository coordinates ("owner/repo"), got "octocat/hello-world.git"',
      ),
    );
  });

  it('preserves duplicate repository entries in scope', () => {
    process.env.INPUT_SCOPE = 'octocat/hello-world\noctocat/hello-world';
    expect(
      rtInputs().scope(),
      'Duplicate repository scope entries were unexpectedly dropped or rejected',
    ).toStrictEqual(['octocat/hello-world', 'octocat/hello-world']);
  });

  it('delegates coordinate parsing to injected coordinates factory', () => {
    process.env.INPUT_SCOPE = 'custom-org/custom-repo';
    const inputs = rtInputs(stGrip, (raw) => ({
      normalized: () => `injected:${raw.trim().toLowerCase()}`,
    }));
    expect(
      inputs.scope(),
      'Injected coordinates factory was not invoked for scope parsing',
    ).toStrictEqual(['injected:custom-org/custom-repo']);
  });

  it('preserves allowed statuses reference identity across repeated calls', () => {
    process.env['INPUT_ALLOWED-STATUSES'] = 'opened\nclosed';
    const inputs = rtInputs();
    const first = inputs.allowedStatuses();
    const second = inputs.allowedStatuses();
    expect(
      first,
      'Allowed statuses array reference changed between subsequent calls',
    ).toBe(second);
  });

  it('preserves memoized value when environment changes after first call', () => {
    process.env['INPUT_ALLOWED-STATUSES'] = 'opened';
    const inputs = rtInputs();
    inputs.allowedStatuses();
    process.env['INPUT_ALLOWED-STATUSES'] = 'closed';
    expect(
      inputs.allowedStatuses(),
      'The allowed statuses were not memoized across environment mutations',
    ).toStrictEqual(['opened']);
  });

  it('re-reads environment values when configured with real-time grip', () => {
    process.env['INPUT_ALLOWED-STATUSES'] = 'opened';
    const inputs = rtInputs(rtGrip);
    inputs.allowedStatuses();
    process.env['INPUT_ALLOWED-STATUSES'] = 'closed';
    expect(
      inputs.allowedStatuses(),
      'The allowed statuses did not reflect environment updates under real-time grip',
    ).toStrictEqual(['closed']);
  });
});
