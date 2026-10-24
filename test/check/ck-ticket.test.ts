/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import { fkTicket } from '#backlog/fk-ticket.ts';
import { ckOk } from '#check/ck-ok.ts';
import { ckTicket } from '#check/ck-ticket.ts';
import { fkInputs } from '#inputs/fk-inputs.ts';
import { fkPullRequest } from '#pull-request/fk-pull-request.ts';
import { rpPlain } from '#repository/rp-plain.ts';

describe('a ticket criteria check', () => {
  it('passes when ticket satisfies all criteria', () => {
    const inputs = fkInputs({
      allowedStatuses: ['open'],
      requireAuthorAssigned: true,
      requiredLabels: ['bug'],
    });
    const pr = fkPullRequest({
      repository: rpPlain({ owner: 'octo-org', repo: 'octo-repo' }),
    });
    const ticket = fkTicket({
      assignees: ['octocat'],
      labels: ['bug'],
      present: true,
      status: 'open',
      url: 'https://github.com/octo-org/octo-repo/issues/42',
    });
    const actual = ckTicket(inputs, pr, ticket);
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
      'The ticket check failed even though all validation criteria were satisfied',
    ).toStrictEqual(passed);
  });

  it('fails with ticket-not-found when ticket does not exist in tracker', () => {
    const inputs = fkInputs();
    const pr = fkPullRequest();
    const ticket = fkTicket();
    const actual = ckTicket(inputs, pr, ticket);
    const result = {
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const expected = {
      reason: 'ticket-not-found',
      valid: false,
    };

    expect(
      result,
      'The ticket check did not fail with ticket-not-found when ticket is absent',
    ).toStrictEqual(expected);
  });

  it('fails with scope-violation when resolved ticket URL violates repository scope', () => {
    const inputs = fkInputs();
    const pr = fkPullRequest({
      repository: rpPlain({ owner: 'octo-org', repo: 'octo-repo' }),
    });
    const ticket = fkTicket({
      present: true,
      url: 'https://github.com/external-org/other-repo/issues/42',
    });
    const actual = ckTicket(inputs, pr, ticket);
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
      'The ticket check did not fail with scope-violation when ticket URL points to external repository',
    ).toStrictEqual(expected);
  });

  it('fails with status-not-allowed when ticket status is disallowed', () => {
    const inputs = fkInputs({ allowedStatuses: ['open'] });
    const pr = fkPullRequest({
      repository: rpPlain({ owner: 'octo-org', repo: 'octo-repo' }),
    });
    const ticket = fkTicket({
      present: true,
      status: 'closed',
      url: 'https://github.com/octo-org/octo-repo/issues/42',
    });
    const actual = ckTicket(inputs, pr, ticket);
    const result = {
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const expected = {
      reason: 'status-not-allowed',
      valid: false,
    };

    expect(
      result,
      'The ticket check did not fail with status-not-allowed when ticket status was closed',
    ).toStrictEqual(expected);
  });

  it('fails with missing-required-label when ticket lacks required label', () => {
    const inputs = fkInputs({ requiredLabels: ['approved'] });
    const pr = fkPullRequest({
      repository: rpPlain({ owner: 'octo-org', repo: 'octo-repo' }),
    });
    const ticket = fkTicket({
      labels: ['bug'],
      present: true,
      status: 'open',
      url: 'https://github.com/octo-org/octo-repo/issues/42',
    });
    const actual = ckTicket(inputs, pr, ticket);
    const result = {
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const expected = {
      reason: 'missing-required-label',
      valid: false,
    };

    expect(
      result,
      'The ticket check did not fail with missing-required-label when ticket lacked approved label',
    ).toStrictEqual(expected);
  });

  it('fails with forbidden-label when ticket contains forbidden label', () => {
    const inputs = fkInputs({ forbiddenLabels: ['wontfix'] });
    const pr = fkPullRequest({
      repository: rpPlain({ owner: 'octo-org', repo: 'octo-repo' }),
    });
    const ticket = fkTicket({
      labels: ['wontfix'],
      present: true,
      status: 'open',
      url: 'https://github.com/octo-org/octo-repo/issues/42',
    });
    const actual = ckTicket(inputs, pr, ticket);
    const result = {
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const expected = {
      reason: 'forbidden-label',
      valid: false,
    };

    expect(
      result,
      'The ticket check did not fail with forbidden-label when ticket carried wontfix label',
    ).toStrictEqual(expected);
  });

  it('fails with author-not-assigned when pull request author is not assigned', () => {
    const inputs = fkInputs({ requireAuthorAssigned: true });
    const pr = fkPullRequest({
      author: 'contributor',
      repository: rpPlain({ owner: 'octo-org', repo: 'octo-repo' }),
    });
    const ticket = fkTicket({
      assignees: ['maintainer'],
      present: true,
      status: 'open',
      url: 'https://github.com/octo-org/octo-repo/issues/42',
    });
    const actual = ckTicket(inputs, pr, ticket);
    const result = {
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const expected = {
      reason: 'author-not-assigned',
      valid: false,
    };

    expect(
      result,
      'The ticket check did not fail with author-not-assigned when author was absent from assignees',
    ).toStrictEqual(expected);
  });
});
