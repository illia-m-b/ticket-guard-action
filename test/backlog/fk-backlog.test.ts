/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import type { FakeTicket } from '#backlog/fk-ticket.ts';
import type { Reference } from '#reference/reference.ts';

import { fkBacklog } from '#backlog/fk-backlog.ts';
import { fkTicket } from '#backlog/fk-ticket.ts';
import { rfEmpty } from '#reference/rf-empty.ts';
import { rfGitHub } from '#reference/rf-git-hub.ts';
import { rpPlain } from '#repository/rp-plain.ts';

describe('an in-memory backlog instance', () => {
  it('returns fake ticket when reference is absent', async () => {
    const backlog = fkBacklog([]);
    const reference = rfEmpty();
    const repository = rpPlain({ owner: 'octo', repo: 'app' });
    const retrieved = await backlog.ticket(reference, repository);
    let actualId: unknown;
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
    const fake = fkTicket();
    let fkId: unknown;
    try {
      fkId = fake.id();
    } catch (error: unknown) {
      fkId = error;
    }
    const expected = {
      assignees: fake.assignees(),
      id: fkId,
      labels: fake.labels(),
      present: fake.present(),
      status: fake.status(),
      url: fake.url(),
    };

    expect(
      actual,
      'A ticket with nondefault fields was returned though reference is absent',
    ).toStrictEqual(expected);
  });

  it('returns fake ticket when search fails', async () => {
    const backlog = fkBacklog([]);
    const reference: Reference = {
      id: () => String(Number.MAX_SAFE_INTEGER),
      present: () => true,
      raw: () => `#${Number.MAX_SAFE_INTEGER}`,
    };
    const repository = rpPlain({ owner: 'octo', repo: 'app' });
    const retrieved = await backlog.ticket(reference, repository);
    let actualId: unknown;
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
    const fake = fkTicket();
    let fkId: unknown;
    try {
      fkId = fake.id();
    } catch (error: unknown) {
      fkId = error;
    }
    const expected = {
      assignees: fake.assignees(),
      id: fkId,
      labels: fake.labels(),
      present: fake.present(),
      status: fake.status(),
      url: fake.url(),
    };

    expect(
      actual,
      'A ticket with nondefault fields was returned though search failed',
    ).toStrictEqual(expected);
  });

  it('returns present ticket successfully', async () => {
    const number = new Date().getDate();
    const expected: FakeTicket = {
      assignees: [],
      id: String(number),
      labels: ['wontfix'],
      present: true,
      status: 'open',
      url: 'https://github.com/illia-m-b/ticket-guard-action/issues/4',
    };
    const ticket = fkTicket(expected);
    const reference = rfGitHub(`Closes #${number}.`);
    const repository = rpPlain({
      owner: 'illia-m-b',
      repo: 'ticket-guard-action',
    });
    const backlog = fkBacklog([ticket]);
    const found = await backlog.ticket(reference, repository);
    const actual = {
      assignees: found.assignees(),
      id: found.id(),
      labels: found.labels(),
      present: found.present(),
      status: found.status(),
      url: found.url(),
    };

    expect(
      actual,
      'The retrieved ticket did not match the expected preset ticket values',
    ).toStrictEqual(expected);
  });
});
