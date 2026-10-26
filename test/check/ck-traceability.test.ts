/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { randomInt } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import type { Backlog } from '#backlog/backlog.ts';
import type { Ticket } from '#backlog/ticket.ts';

import { fkBacklog } from '#backlog/fk-backlog.ts';
import { fkTicket } from '#backlog/fk-ticket.ts';
import { ckFailed } from '#check/ck-failed.ts';
import { ckOk } from '#check/ck-ok.ts';
import { ckTraceability } from '#check/ck-traceability.ts';
import { fkInputs } from '#inputs/fk-inputs.ts';
import { fkPullRequest } from '#pull-request/fk-pull-request.ts';
import { rfEmpty } from '#reference/rf-empty.ts';
import { rpPlain } from '#repository/rp-plain.ts';

describe('a composite traceability policy check', () => {
  it('passes when all criteria are met', async () => {
    const required = ['approved', 'bug'];
    const inputs = fkInputs({
      extractFrom: ['pr-body'],
      forbiddenLabels: ['wontfix', 'invalid'],
      requireAllLabels: true,
      requireAuthorAssigned: true,
      requiredLabels: required,
    });
    const author = 'octocat';
    const id = String(randomInt(1000, 10_000));
    const repository = rpPlain({ owner: 'octo-org', repo: 'octo-repo' });
    const pr = fkPullRequest({
      author,
      body: `Closes #${id}`,
      repository,
    });
    const ticket = fkTicket({
      assignees: [author, 'jane-doe'],
      id,
      labels: ['help wanted', ...required, 'question'],
      present: true,
      status: 'open',
      url: `https://github.com/${repository.owner()}/${repository.name()}/issues/${id}/`,
    });
    const actual = await ckTraceability(inputs, pr, fkBacklog([ticket]));
    const result = {
      message: actual.message(),
      reason: actual.reason(),
      ticket: actual.ticket().id(),
      valid: actual.valid(),
    };
    const passed = {
      message: ckOk().message(),
      reason: ckOk().reason(),
      ticket: id,
      valid: true,
    };
    expect(
      result,
      'A composite traceability check failed even though no policy violations were detected',
    ).toStrictEqual(passed);
  });

  it('fails with "no-ticket-found" reason when no reference is found', async () => {
    const actual = await ckTraceability(
      fkInputs({ extractFrom: ['pr-body'] }),
      fkPullRequest({ body: 'plain commit message without reference' }),
      fkBacklog([]),
    );
    const result = {
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
      result,
      'A composite traceability check did not fail due to reference absence',
    ).toStrictEqual(failed);
  });

  it('fails without querying backlog when reference is absent', async () => {
    const backlog: Backlog = {
      ticket: () => {
        throw new Error('Backlog queried when reference is absent');
      },
    };
    const actual = await ckTraceability(
      fkInputs({ extractFrom: ['pr-body'] }),
      fkPullRequest({ body: 'plain commit message without reference' }),
      backlog,
    );
    const result = {
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
      result,
      'A composite traceability check evaluated backlog despite reference absence',
    ).toStrictEqual(failed);
  });

  it('fails without querying ticket accessors when ticket is absent in backlog', async () => {
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
    const actual = await ckTraceability(
      fkInputs(),
      fkPullRequest({ body: 'Fixes #9021' }),
      fkBacklog([ticket]),
    );
    const result = {
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
      result,
      'A composite traceability check evaluated ticket accessors despite ticket absence in backlog',
    ).toStrictEqual(failed);
  });

  it('fails with "ticket-not-found" reason when referenced ticket is not found in backlog', async () => {
    const actual = await ckTraceability(
      fkInputs(),
      fkPullRequest({ body: `Closes #${new Date().getFullYear()}` }),
      fkBacklog([]),
    );
    const result = {
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
      result,
      'A composite traceability check did not fail due to ticket absence in backlog',
    ).toStrictEqual(failed);
  });

  it('fails when issue scope is violated', async () => {
    const pr = fkPullRequest({ body: 'Fixes google/guava#8738' });
    const actual = await ckTraceability(fkInputs(), pr, fkBacklog([]));
    const result = {
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
      result,
      'A composite traceability check did not fail due to ticket scope violation',
    ).toStrictEqual(failed);
  });

  it('fails when ticket url is not a valid github repository url', async () => {
    const pr = fkPullRequest({ body: 'Fixes #8738' });
    const ticket = fkTicket({
      id: '8738',
      present: true,
      url: 'https://tracker.corp.internal/issue/TICK-9418',
    });
    const actual = await ckTraceability(fkInputs(), pr, fkBacklog([ticket]));
    const result = {
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
      result,
      'A composite traceability check did not fail when ticket url is not a valid github repository url',
    ).toStrictEqual(failed);
  });

  it('fails when ticket has a disallowed status', async () => {
    const pr = fkPullRequest({
      body: 'Fixes google/guava#8738',
      repository: rpPlain({ owner: 'google', repo: 'guava' }),
    });
    const ticket = fkTicket({
      id: '8738',
      present: true,
      status: 'closed',
      url: 'https://github.com/google/guava/issues/8738',
    });
    const actual = await ckTraceability(fkInputs(), pr, fkBacklog([ticket]));
    const result = {
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
      result,
      'A composite traceability check did not fail due to a disallowed ticket status',
    ).toStrictEqual(failed);
  });

  it('bypasses status validation when no allowed statuses are specified', async () => {
    const pr = fkPullRequest({ body: 'Closes #123' });
    const inputs = fkInputs({ allowedStatuses: [] });
    const ticket = fkTicket({
      id: '123',
      present: true,
      status: 'closed',
      url: 'https://github.com/octo-org/octo-repo/issues/123',
    });
    const actual = await ckTraceability(inputs, pr, fkBacklog([ticket]));
    const result = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const bypassed = {
      message: ckOk().message(),
      reason: ckOk().reason(),
      valid: ckOk().valid(),
    };
    expect(
      result,
      'A composite traceability check did not pass with closed ticket even though no allowed statuses were specified',
    ).toStrictEqual(bypassed);
  });

  it('fails when some required labels are missing', async () => {
    const required = ['assigned', 'approved'];
    const inputs = fkInputs({
      requireAllLabels: true,
      requiredLabels: required,
    });
    const pr = fkPullRequest({
      body: 'Fixes #2',
      repository: rpPlain({ owner: 'illia-m-b', repo: 'veils-js' }),
    });
    const ticket = fkTicket({
      id: '2',
      labels: [required[randomInt(0, required.length)] ?? ''],
      present: true,
      status: 'open',
      url: 'https://github.com/illia-m-b/veils-js/issues/2',
    });
    const actual = await ckTraceability(inputs, pr, fkBacklog([ticket]));
    const result = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const expected = ckFailed(
      'missing-required-label',
      `Missing required label(s). All of the following are required: ${JSON.stringify(required)}`,
    );
    const failed = {
      message: expected.message(),
      reason: expected.reason(),
      valid: expected.valid(),
    };
    expect(
      result,
      'A composite traceability check did not fail even though ticket is missing required labels',
    ).toStrictEqual(failed);
  });

  it('fails when a forbidden label is present', async () => {
    const forbidden = ['wontfix', 'question', 'duplicate'];
    const inputs = fkInputs({ forbiddenLabels: forbidden });
    const pr = fkPullRequest({
      body: 'Fixes #20',
      repository: rpPlain({
        owner: 'illia-m-b',
        repo: 'ticket-guard-action',
      }),
    });
    const ticket = fkTicket({
      id: '20',
      labels: [forbidden[randomInt(0, forbidden.length)] ?? 'wontfix'],
      present: true,
      status: 'open',
      url: 'https://github.com/illia-m-b/ticket-guard-action/issues/20',
    });
    const actual = await ckTraceability(inputs, pr, fkBacklog([ticket]));
    const result = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const expected = ckFailed(
      'forbidden-label',
      `Found the banned label(s). Here is a full list of banned ones: ${JSON.stringify(forbidden)}`,
    );
    const failed = {
      message: expected.message(),
      reason: expected.reason(),
      valid: expected.valid(),
    };
    expect(
      result,
      'A composite traceability check did not fail even though ticket contains a forbidden label',
    ).toStrictEqual(failed);
  });

  it('fails when author is not assigned and assignment is required', async () => {
    const inputs = fkInputs({ requireAuthorAssigned: true });
    const author = 'anonymous';
    const pr = fkPullRequest({
      author,
      body: 'Fixes octo-org/octo-repo#321',
    });
    const ticket = fkTicket({
      id: '321',
      present: true,
      status: 'open',
      url: 'https://github.com/octo-org/octo-repo/issues/321',
    });
    const actual = await ckTraceability(inputs, pr, fkBacklog([ticket]));
    const result = {
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
      result,
      'A composite traceability check did not fail even though author is not assigned and assignment is required',
    ).toStrictEqual(failed);
  });

  it('bypasses author assignment check when it is not required', async () => {
    const pr = fkPullRequest({ body: 'Closes #123' });
    const ticket = fkTicket({
      id: '123',
      present: true,
      status: 'open',
      url: 'https://github.com/octo-org/octo-repo/issues/123',
    });
    const actual = await ckTraceability(fkInputs(), pr, fkBacklog([ticket]));
    const result = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const bypassed = {
      message: ckOk().message(),
      reason: ckOk().reason(),
      valid: ckOk().valid(),
    };
    expect(
      result,
      'A composite traceability check did not pass when author assignment is not required',
    ).toStrictEqual(bypassed);
  });

  it('bypasses label checks without querying ticket labels when unconfigured', async () => {
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
    const pr = fkPullRequest({ body: 'Closes #1' });
    const actual = await ckTraceability(inputs, pr, fkBacklog([ticket]));
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
      'A composite traceability check queried ticket labels when no label checks were configured',
    ).toStrictEqual(passed);
  });

  it('bypasses validation when author matches ignore-actors', async () => {
    const author = 'dependabot[bot]';
    const inputs = fkInputs({ ignoreActors: [author] });
    const pr = fkPullRequest({ author });
    const actual = await ckTraceability(inputs, pr, fkBacklog([]));
    const result = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const expected = {
      message: `Validation bypassed: author "${author}" is in ignore-actors`,
      reason: 'ok',
      valid: true,
    };
    expect(
      result,
      'A composite traceability check did not bypass validation for an ignored actor',
    ).toStrictEqual(expected);
  });

  it('supports custom reference extractor', async () => {
    const pr = fkPullRequest({ body: 'Fixes JIRA-456' });
    const ticket = fkTicket({
      id: 'JIRA-456',
      present: true,
      status: 'open',
      url: 'https://octo-org.atlassian.net/browse/JIRA-456',
    });
    const actual = await ckTraceability(
      fkInputs({ scope: 'any' }),
      pr,
      fkBacklog([ticket]),
      (text: string) => {
        const match = /\b[A-Z]+-\d+\b/.exec(text);
        return match === null
          ? rfEmpty()
          : {
              id: () => match[0],
              present: () => true,
              raw: () => match[0],
            };
      },
    );
    const result = {
      id: actual.ticket().id(),
      valid: actual.valid(),
    };
    const expected = {
      id: 'JIRA-456',
      valid: true,
    };
    expect(
      result,
      'A composite traceability check did not support custom reference extractor',
    ).toStrictEqual(expected);
  });
});
