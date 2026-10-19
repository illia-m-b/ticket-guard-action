/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { IssuePayload } from '#backlog/github/octokit.ts';
import type { Octokit } from '#backlog/github/octokit.ts';

import { fkTicket } from '#backlog/fk-ticket.ts';
import { fkOctokit } from '#backlog/github/fk-octokit.ts';
import { ghIssues } from '#backlog/github/gh-issues.ts';
import { rfEmpty } from '#reference/rf-empty.ts';
import { rfGitHub } from '#reference/rf-git-hub.ts';
import { rpPlain } from '#repository/rp-plain.ts';

void describe('A GitHub issues adapter', { concurrency: true }, () => {
  void it('returns fake ticket when reference is absent', async () => {
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
    const owner = 'actions';
    const repository = 'toolkit';
    const backlog = ghIssues(fkOctokit(), rpPlain({ owner, repo: repository }));
    const retrieved = await backlog.ticket(reference);
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
    assert.deepStrictEqual(
      actual,
      defaults,
      'Retrieved fields differ from fake ticket defaults when reference is absent',
    );
  });

  void it('returns fake ticket when ticket is not found', async () => {
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
    const repository = 'setup';
    const number = new Date().getSeconds() + 1;
    const reference = rfGitHub(`Closes ${owner}/${repository}#${number}`);
    const backlog = ghIssues(
      fkOctokit({ status: 404 }),
      rpPlain({ owner, repo: repository }),
    );
    const retrieved = await backlog.ticket(reference);
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
    assert.deepStrictEqual(
      actual,
      defaults,
      'Retrieved fields differ from fake ticket defaults when ticket is not found',
    );
  });

  void it('returns ticket when search succeeds', async () => {
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
    const backlog = ghIssues(
      fkOctokit({ issue: payload }),
      rpPlain({
        owner: 'yokoffing',
        repo: 'betterfox',
      }),
    );
    const reference = rfGitHub('Closes #167');
    const retrieved = await backlog.ticket(reference);
    const actual = {
      assignees: retrieved.assignees(),
      id: retrieved.id(),
      labels: retrieved.labels(),
      present: retrieved.present(),
      status: retrieved.status(),
      url: retrieved.url(),
    };
    assert.deepStrictEqual(
      actual,
      expected,
      'Retrieved ticket does not match the expected backlog issue',
    );
  });

  void it('re-throws unknown errors', async () => {
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
    const backlog = ghIssues(buggy, rpPlain({ owner: 'pnpm', repo: 'setup' }));
    await assert.rejects(
      async () => backlog.ticket(reference),
      { message: 'This client is buggy as hell' },
      'An unknown error from the Octokit client was silently ignored',
    );
  });
});
