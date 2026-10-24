/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import type { IssuePayload } from '#backlog/github/octokit.ts';
import type { Octokit } from '#backlog/github/octokit.ts';

import { fkTicket } from '#backlog/fk-ticket.ts';
import { fkOctokit } from '#backlog/github/fk-octokit.ts';
import { ghIssues } from '#backlog/github/gh-issues.ts';
import { rfEmpty } from '#reference/rf-empty.ts';
import { rfGitHub } from '#reference/rf-git-hub.ts';
import { rpPlain } from '#repository/rp-plain.ts';

describe('a GitHub issues adapter', () => {
  it('returns fake ticket when reference is absent', async () => {
    const fake = fkTicket();
    let fkId;
    try {
      fkId = fake.id();
    } catch (error: unknown) {
      fkId = error;
    }
    const defaults = {
      assignees: fake.assignees(),
      id: fkId,
      labels: fake.labels(),
      present: fake.present(),
      status: fake.status(),
      url: fake.url(),
    };
    const reference = rfEmpty();
    const repository = rpPlain({ owner: 'octo', repo: 'app' });
    const backlog = ghIssues(fkOctokit());
    const retrieved = await backlog.ticket(reference, repository);
    let actualId;
    try {
      actualId = retrieved.id();
    } catch (error: unknown) {
      actualId = error;
    }
    const actual = {
      assignees: retrieved.assignees(),
      id: actualId,
      labels: retrieved.labels(),
      present: retrieved.present(),
      status: retrieved.status(),
      url: retrieved.url(),
    };

    expect(
      actual,
      'Retrieved fields differ from fake ticket defaults when reference is absent',
    ).toStrictEqual(defaults);
  });

  it('returns fake ticket when ticket is not found', async () => {
    const fake = fkTicket();
    let fkId;
    try {
      fkId = fake.id();
    } catch (error: unknown) {
      fkId = error;
    }
    const defaults = {
      assignees: fake.assignees(),
      id: fkId,
      labels: fake.labels(),
      present: fake.present(),
      status: fake.status(),
      url: fake.url(),
    };
    const owner = 'pnpm';
    const repository_ = 'setup';
    const number = new Date().getSeconds() + 1;
    const reference = rfGitHub(`Closes ${owner}/${repository_}#${number}`);
    const repository = rpPlain({ owner, repo: repository_ });
    const backlog = ghIssues(fkOctokit({ status: 404 }));
    const retrieved = await backlog.ticket(reference, repository);
    let actualId;
    try {
      actualId = retrieved.id();
    } catch (error: unknown) {
      actualId = error;
    }
    const actual = {
      assignees: retrieved.assignees(),
      id: actualId,
      labels: retrieved.labels(),
      present: retrieved.present(),
      status: retrieved.status(),
      url: retrieved.url(),
    };

    expect(
      actual,
      'Retrieved fields differ from fake ticket defaults when ticket is not found',
    ).toStrictEqual(defaults);
  });

  it('returns ticket when search succeeds', async () => {
    const payload: IssuePayload = {
      assignees: [{ login: 'yokoffing' }],
      html_url: 'https://github.com/yokoffing/Betterfox/issues/167',
      labels: [
        { name: ':arrow_up: enhancement' },
        { name: ':recycle: ongoing' },
      ],
      number: 167,
      state: 'open',
    };
    const expected = {
      assignees: ['yokoffing'],
      id: '167',
      labels: [':arrow_up: enhancement', ':recycle: ongoing'],
      present: true,
      status: 'open',
      url: 'https://github.com/yokoffing/Betterfox/issues/167',
    };
    const backlog = ghIssues(fkOctokit({ issue: payload }));
    const reference = rfGitHub('Closes #167');
    const repository = rpPlain({ owner: 'yokoffing', repo: 'betterfox' });
    const retrieved = await backlog.ticket(reference, repository);
    const actual = {
      assignees: retrieved.assignees(),
      id: retrieved.id(),
      labels: retrieved.labels(),
      present: retrieved.present(),
      status: retrieved.status(),
      url: retrieved.url(),
    };

    expect(
      actual,
      'Retrieved ticket does not match the expected backlog issue',
    ).toStrictEqual(expected);
  });

  it('retrieves ticket from target repository coordinates', async () => {
    const reference = rfGitHub('Closes scoped-org/scoped-repo#55');
    const repository = rpPlain({ owner: 'scoped-org', repo: 'scoped-repo' });
    const backlog = ghIssues(fkOctokit());
    const retrieved = await backlog.ticket(reference, repository);

    expect(
      retrieved.url(),
      'Retrieved ticket URL did not match the scoped repository in the reference',
    ).toBe('https://github.com/scoped-org/scoped-repo/issues/55');
  });

  it('fails with diagnostic message when token is unauthorized', async () => {
    const reference = rfGitHub('Closes #10');
    const repository = rpPlain({ owner: 'octo', repo: 'app' });
    const backlog = ghIssues(fkOctokit({ status: 401 }));

    await expect(
      backlog.ticket(reference, repository),
      'An unauthorized token error did not fail with the expected message',
    ).rejects.toThrow(
      new Error(
        'GitHub token lacks permissions to access issues in "octo/app"',
      ),
    );
  });

  it('fails with diagnostic message when token permissions are forbidden', async () => {
    const reference = rfGitHub('Closes #10');
    const repository = rpPlain({ owner: 'octo', repo: 'app' });
    const backlog = ghIssues(fkOctokit({ status: 403 }));

    await expect(
      backlog.ticket(reference, repository),
      'A forbidden token permissions error did not fail with the expected message',
    ).rejects.toThrow(
      new Error(
        'GitHub token lacks permissions to access issues in "octo/app"',
      ),
    );
  });

  it('re-throws unknown errors', async () => {
    const buggy: Octokit = {
      rest: {
        issues: {
          get: async (_parameters) => {
            throw new Error('This client is buggy as hell');
          },
        },
      },
    };
    const reference = rfGitHub('Closes #91');
    const repository = rpPlain({ owner: 'pnpm', repo: 'setup' });
    const backlog = ghIssues(buggy);

    await expect(
      backlog.ticket(reference, repository),
      'An unknown error from the Octokit client was silently ignored',
    ).rejects.toThrow(new Error('This client is buggy as hell'));
  });

  it('re-throws server errors with http status code', async () => {
    const error = Object.assign(new Error('Internal Server Error'), {
      status: 500,
    });
    const failing: Octokit = {
      rest: {
        issues: {
          get: async () => {
            throw error;
          },
        },
      },
    };
    const reference = rfGitHub('Closes #99');
    const repository = rpPlain({ owner: 'pnpm', repo: 'setup' });
    const backlog = ghIssues(failing);

    await expect(
      backlog.ticket(reference, repository),
      'A server error carrying HTTP status 500 was not rethrown',
    ).rejects.toThrow(error);
  });
});
