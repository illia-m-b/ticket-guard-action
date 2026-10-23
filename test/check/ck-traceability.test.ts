/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { randomInt } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import type { Ticket } from '#backlog/ticket.ts';

import { fkTicket } from '#backlog/fk-ticket.ts';
import { ckFailed } from '#check/ck-failed.ts';
import { ckOk } from '#check/ck-ok.ts';
import { ckTraceability } from '#check/ck-traceability.ts';
import { fkInputs } from '#inputs/fk-inputs.ts';
import { fkPullRequest } from '#pull-request/fk-pull-request.ts';
import { rfEmpty } from '#reference/rf-empty.ts';
import { rfGitHub } from '#reference/rf-git-hub.ts';
import { rpPlain } from '#repository/rp-plain.ts';

describe('a composite traceability policy check', () => {
  it('passes when all criteria are met', () => {
    const requiredLabels = ['approved', 'bug'];
    const inputs = fkInputs({
      extractFrom: ['pr-body'],
      forbiddenLabels: ['wontfix', 'invalid'],
      requireAllLabels: true,
      requireAuthorAssigned: true,
      requiredLabels,
    });
    const author = 'octocat';
    const id = String(randomInt(1000, 10_000));
    const body = `Closes #${id}`;
    const repository = rpPlain({ owner: 'octo-org', repo: 'octo-repo' });
    const pr = fkPullRequest({
      author,
      body,
      repository,
    });
    const reference = rfGitHub(body);
    const ticket = fkTicket({
      assignees: [author, 'jane-doe'],
      id,
      labels: ['help wanted', ...requiredLabels, 'question'],
      present: true,
      status: 'open',
      url: `https://github.com/${repository.owner()}/${repository.name()}/issues/${id}/`,
    });
    const actual = ckTraceability(inputs, pr, reference, ticket);
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const ok = ckOk();
    const passed = {
      message: ok.message(),
      reason: ok.reason(),
      valid: ok.valid(),
    };

    expect(
      check,
      'A composite traceability check failed even though no policy violations were detected',
    ).toStrictEqual(passed);
  });

  it('fails with "no-ticket-found" reason when no reference is found', () => {
    const actual = ckTraceability(
      fkInputs(),
      fkPullRequest(),
      rfEmpty(),
      fkTicket(),
    );
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const expected = ckFailed(
      'no-ticket-found',
      'No issue reference found in the pull request',
    );
    const failed = {
      message: expected.message(),
      reason: expected.reason(),
      valid: expected.valid(),
    };

    expect(
      check,
      'A composite traceability check did not fail due to reference absence',
    ).toStrictEqual(failed);
  });

  it('fails without querying ticket accessors when reference is absent', () => {
    const ticket: Ticket = {
      assignees: () => {
        throw new Error('assignees queried on absent ticket');
      },
      id: () => {
        throw new Error('id queried on absent ticket');
      },
      labels: () => {
        throw new Error('labels queried on absent ticket');
      },
      present: () => false,
      status: () => {
        throw new Error('status queried on absent ticket');
      },
      url: () => {
        throw new Error('url queried on absent ticket');
      },
    };
    const actual = ckTraceability(
      fkInputs(),
      fkPullRequest(),
      rfEmpty(),
      ticket,
    );
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const expected = ckFailed(
      'no-ticket-found',
      'No issue reference found in the pull request',
    );
    const failed = {
      message: expected.message(),
      reason: expected.reason(),
      valid: expected.valid(),
    };

    expect(
      check,
      'A composite traceability check evaluated ticket accessors despite reference absence',
    ).toStrictEqual(failed);
  });

  it('fails without querying ticket accessors when ticket is absent in backlog', () => {
    const ticket: Ticket = {
      assignees: () => {
        throw new Error('assignees queried on absent ticket');
      },
      id: () => {
        throw new Error('id queried on absent ticket');
      },
      labels: () => {
        throw new Error('labels queried on absent ticket');
      },
      present: () => false,
      status: () => {
        throw new Error('status queried on absent ticket');
      },
      url: () => {
        throw new Error('url queried on absent ticket');
      },
    };
    const actual = ckTraceability(
      fkInputs(),
      fkPullRequest(),
      rfGitHub('Fixes #9021'),
      ticket,
    );
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const expected = ckFailed(
      'ticket-not-found',
      'Ticket not found. Check your backlog',
    );
    const failed = {
      message: expected.message(),
      reason: expected.reason(),
      valid: expected.valid(),
    };

    expect(
      check,
      'A composite traceability check evaluated ticket accessors despite ticket absence in backlog',
    ).toStrictEqual(failed);
  });

  it('fails with "ticket-not-found" reason when referenced ticket is not found in backlog', () => {
    const actual = ckTraceability(
      fkInputs(),
      fkPullRequest(),
      rfGitHub(`Closes #${new Date().getFullYear()}`),
      fkTicket(),
    );
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const expected = ckFailed(
      'ticket-not-found',
      'Ticket not found. Check your backlog',
    );
    const failed = {
      message: expected.message(),
      reason: expected.reason(),
      valid: expected.valid(),
    };

    expect(
      check,
      'A composite traceability check did not fail due to ticket absence in backlog',
    ).toStrictEqual(failed);
  });

  it('fails when issue scope is violated', () => {
    const pr = fkPullRequest();
    const reference = rfGitHub('Fixes google/guava#8738');
    const ticket = fkTicket({
      present: true,
      url: 'https://github.com/google/guava/issues/8738',
    });
    const actual = ckTraceability(fkInputs(), pr, reference, ticket);
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const expected = ckFailed(
      'scope-violation',
      `Scope violation: ticket belongs to "google/guava", but pull request targets "${pr.repository().owner()}/${pr.repository().name()}". Scope is set to "current-repo".`,
    );
    const failed = {
      message: expected.message(),
      reason: expected.reason(),
      valid: expected.valid(),
    };

    expect(
      check,
      'A composite traceability check did not fail due to ticket scope violation',
    ).toStrictEqual(failed);
  });

  it('fails when ticket url is not a valid github repository url', () => {
    const pr = fkPullRequest();
    const reference = rfGitHub('Fixes #8738');
    const ticket = fkTicket({
      present: true,
      url: 'https://tracker.corp.internal/issue/TICK-9418',
    });
    const actual = ckTraceability(fkInputs(), pr, reference, ticket);
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const expected = ckFailed(
      'scope-violation',
      'Scope violation: ticket repository coordinates cannot be determined. Scope is set to "current-repo".',
    );
    const failed = {
      message: expected.message(),
      reason: expected.reason(),
      valid: expected.valid(),
    };

    expect(
      check,
      'A composite traceability check did not fail when ticket url is not a valid github repository url',
    ).toStrictEqual(failed);
  });

  it('fails when ticket has a disallowed status', () => {
    const reference = rfGitHub('Fixes google/guava#8738');
    const ticket = fkTicket({
      present: true,
      status: 'closed',
      url: 'https://github.com/google/guava/issues/8738',
    });
    const actual = ckTraceability(
      fkInputs(),
      fkPullRequest({
        repository: rpPlain({ owner: 'google', repo: 'guava' }),
      }),
      reference,
      ticket,
    );
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const expected = ckFailed(
      'status-not-allowed',
      'Status must be one of the following: ["open"]. Got "closed" instead.',
    );
    const failed = {
      message: expected.message(),
      reason: expected.reason(),
      valid: expected.valid(),
    };

    expect(
      check,
      'A composite traceability check did not fail due to a disallowed ticket status',
    ).toStrictEqual(failed);
  });

  it('bypasses status validation when no allowed statuses are specified', () => {
    const pr = fkPullRequest();
    const inputs = fkInputs({ allowedStatuses: [] });
    const reference = rfGitHub('Closes #123');
    const ticket = fkTicket({
      present: true,
      status: 'closed',
      url: 'https://github.com/octo-org/octo-repo/issues/123',
    });
    const actual = ckTraceability(inputs, pr, reference, ticket);
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const ok = ckOk();
    const bypassed = {
      message: ok.message(),
      reason: ok.reason(),
      valid: ok.valid(),
    };

    expect(
      check,
      'A composite traceability check did not pass with closed ticket even though no allowed statuses were specified',
    ).toStrictEqual(bypassed);
  });

  it('fails when some required labels are missing', () => {
    const requiredLabels = ['assigned', 'approved'];
    const inputs = fkInputs({ requireAllLabels: true, requiredLabels });
    const pr = fkPullRequest({
      repository: rpPlain({ owner: 'illia-m-b', repo: 'veils-js' }),
    });
    const reference = rfGitHub('Fixes #2');
    const ticket = fkTicket({
      labels: [requiredLabels[randomInt(0, requiredLabels.length)] ?? ''],
      present: true,
      status: 'open',
      url: 'https://github.com/illia-m-b/veils-js/issues/2',
    });
    const actual = ckTraceability(inputs, pr, reference, ticket);
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const expected = ckFailed(
      'missing-required-label',
      `Missing required label(s). All of the following are required: ${JSON.stringify(requiredLabels)}`,
    );
    const failed = {
      message: expected.message(),
      reason: expected.reason(),
      valid: expected.valid(),
    };

    expect(
      check,
      'A composite traceability check did not fail even though ticket is missing required labels',
    ).toStrictEqual(failed);
  });

  it('fails when a forbidden label is present', () => {
    const forbiddenLabels = ['wontfix', 'question', 'duplicate'];
    const inputs = fkInputs({ forbiddenLabels });
    const pr = fkPullRequest({
      repository: rpPlain({
        owner: 'illia-m-b',
        repo: 'ticket-guard-action',
      }),
    });
    const reference = rfGitHub('Fixes #20');
    const ticket = fkTicket({
      labels: [
        forbiddenLabels[randomInt(0, forbiddenLabels.length)] ?? 'wontfix',
      ],
      present: true,
      status: 'open',
      url: 'https://github.com/illia-m-b/ticket-guard-action/issues/20',
    });
    const actual = ckTraceability(inputs, pr, reference, ticket);
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const expected = ckFailed(
      'forbidden-label',
      `Found the banned label(s). Here is a full list of banned ones: ${JSON.stringify(forbiddenLabels)}`,
    );
    const failed = {
      message: expected.message(),
      reason: expected.reason(),
      valid: expected.valid(),
    };

    expect(
      check,
      'A composite traceability check did not fail even though ticket contains a forbidden label',
    ).toStrictEqual(failed);
  });

  it('fails when author is not assigned and assignment is required', () => {
    const inputs = fkInputs({ requireAuthorAssigned: true });
    const author = 'anonymous';
    const pr = fkPullRequest({ author });
    const reference = rfGitHub('Fixes octo-org/octo-repo#321');
    const ticket = fkTicket({
      present: true,
      status: 'open',
      url: 'https://github.com/octo-org/octo-repo/issues/321',
    });
    const actual = ckTraceability(inputs, pr, reference, ticket);
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const expected = ckFailed(
      'author-not-assigned',
      `The author "${author}" is not among assignees. The current list of assignees: []`,
    );
    const failed = {
      message: expected.message(),
      reason: expected.reason(),
      valid: expected.valid(),
    };

    expect(
      check,
      'A composite traceability check did not fail even though author is not assigned and assignment is required',
    ).toStrictEqual(failed);
  });

  it('bypasses author assignment check when it is not required', () => {
    const reference = rfGitHub('Closes #123');
    const ticket = fkTicket({
      present: true,
      status: 'open',
      url: 'https://github.com/octo-org/octo-repo/issues/123',
    });
    const actual = ckTraceability(
      fkInputs(),
      fkPullRequest(),
      reference,
      ticket,
    );
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const ok = ckOk();
    const bypassed = {
      message: ok.message(),
      reason: ok.reason(),
      valid: ok.valid(),
    };

    expect(
      check,
      'A composite traceability check did not pass when author assignment is not required',
    ).toStrictEqual(bypassed);
  });

  it('bypasses label checks without querying ticket labels when unconfigured', () => {
    const inputs = fkInputs({
      allowedStatuses: [],
      forbiddenLabels: [],
      requiredLabels: [],
      scope: 'any',
    });
    const ticket: Ticket = {
      assignees: () => [],
      id: () => '1',
      labels: () => {
        throw new Error('labels queried when unconfigured');
      },
      present: () => true,
      status: () => 'open',
      url: () => 'https://github.com/octo-org/octo-repo/issues/1',
    };
    const actual = ckTraceability(
      inputs,
      fkPullRequest(),
      rfGitHub('Closes #1'),
      ticket,
    );
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const ok = ckOk();
    const passed = {
      message: ok.message(),
      reason: ok.reason(),
      valid: ok.valid(),
    };

    expect(
      check,
      'A composite traceability check queried ticket labels when no label checks were configured',
    ).toStrictEqual(passed);
  });
});
