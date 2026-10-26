/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import { ckCandidate } from '#check/ck-candidate.ts';
import { ckOk } from '#check/ck-ok.ts';
import { fkInputs } from '#inputs/fk-inputs.ts';
import { fkPullRequest } from '#pull-request/fk-pull-request.ts';
import { rfEmpty } from '#reference/rf-empty.ts';
import { rfGitHub } from '#reference/rf-git-hub.ts';
import { rpPlain } from '#repository/rp-plain.ts';

describe('a candidate reference check', () => {
  it('passes when issue reference is present and within current repository scope', () => {
    const inputs = fkInputs();
    const pr = fkPullRequest({
      repository: rpPlain({ owner: 'octo-org', repo: 'octo-repo' }),
    });
    const reference = rfGitHub('#42');
    const actual = ckCandidate(inputs, pr, reference);
    const result = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const passed = {
      message: ckOk().message(),
      reason: ckOk().reason(),
      valid: ckOk().valid(),
    };

    expect(
      result,
      'The candidate check failed for a present and in-scope issue reference',
    ).toStrictEqual(passed);
  });

  it('fails with no-ticket-found when reference is empty', () => {
    const inputs = fkInputs();
    const pr = fkPullRequest();
    const actual = ckCandidate(inputs, pr, rfEmpty());
    const result = {
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const expected = {
      reason: 'no-ticket-found',
      valid: false,
    };

    expect(
      result,
      'The candidate check did not fail with no-ticket-found for an empty reference',
    ).toStrictEqual(expected);
  });

  it('fails with scope-violation when reference violates repository scope', () => {
    const inputs = fkInputs();
    const pr = fkPullRequest({
      repository: rpPlain({ owner: 'octo-org', repo: 'octo-repo' }),
    });
    const reference = rfGitHub('external-org/other-repo#42');
    const actual = ckCandidate(inputs, pr, reference);
    const result = {
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const expected = {
      reason: 'scope-violation',
      valid: false,
    };

    expect(
      result,
      'The candidate check did not fail with scope-violation when reference belongs to foreign repository',
    ).toStrictEqual(expected);
  });
});
