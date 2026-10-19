/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { FakeTicket } from '#backlog/fk-ticket.ts';
import type { Reference } from '#reference/reference.ts';

import { fkBacklog } from '#backlog/fk-backlog.ts';
import { fkTicket } from '#backlog/fk-ticket.ts';
import { rfEmpty } from '#reference/rf-empty.ts';
import { rfGitHub } from '#reference/rf-git-hub.ts';

void describe('An in-memory backlog instance', { concurrency: true }, () => {
  void it('returns fake ticket when reference is absent', async () => {
    const backlog = fkBacklog([]);
    const reference = rfEmpty();
    const retrieved = await backlog.ticket(reference);
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
    assert.deepStrictEqual(
      actual,
      expected,
      'A ticket with nondefault fields was returned though reference is absent',
    );
  });

  void it('returns fake ticket when search fails', async () => {
    const backlog = fkBacklog([]);
    const reference: Reference = {
      id: () => String(Number.MAX_SAFE_INTEGER),
      present: () => true,
      raw: () => `#${Number.MAX_SAFE_INTEGER}`,
    };
    const retrieved = await backlog.ticket(reference);
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
    assert.deepStrictEqual(
      actual,
      expected,
      'A ticket with nondefault fields was returned though search failed',
    );
  });

  void it('returns present ticket successfully', async () => {
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
    const backlog = fkBacklog([ticket]);
    const found = await backlog.ticket(reference);
    const actual = {
      assignees: found.assignees(),
      id: found.id(),
      labels: found.labels(),
      present: found.present(),
      status: found.status(),
      url: found.url(),
    };
    assert.deepStrictEqual(
      actual,
      expected,
      'The retrieved ticket did not match the expected preset ticket values',
    );
  });
});
