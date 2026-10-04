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

describe('An in-memory backlog instance', { concurrency: true }, () => {
  it('returns fake ticket when reference is absent', async () => {
    const backlog = fkBacklog([]);
    const reference = rfEmpty();
    const retrieved = await backlog.ticket(reference);
    let actualNumber: unknown;
    try {
      actualNumber = retrieved.number();
    } catch (error: unknown) {
      actualNumber = error;
    }
    const actual = {
      assignees: retrieved.assignees(),
      labels: retrieved.labels(),
      number: actualNumber,
      present: retrieved.present(),
      status: retrieved.status(),
      url: retrieved.url(),
    };
    const fake = fkTicket();
    let fkNumber: unknown;
    try {
      fkNumber = fake.number();
    } catch (error: unknown) {
      fkNumber = error;
    }
    const expected = {
      assignees: fake.assignees(),
      labels: fake.labels(),
      number: fkNumber,
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

  it('returns fake ticket when search fails', async () => {
    const backlog = fkBacklog([]);
    const reference: Reference = {
      number: () => Number.MAX_SAFE_INTEGER,
      present: () => true,
      raw: () => `#${Number.MAX_SAFE_INTEGER}`,
    };
    const retrieved = await backlog.ticket(reference);
    let actualNumber: unknown;
    try {
      actualNumber = retrieved.number();
    } catch (error: unknown) {
      actualNumber = error;
    }
    const actual = {
      assignees: retrieved.assignees(),
      labels: retrieved.labels(),
      number: actualNumber,
      present: retrieved.present(),
      status: retrieved.status(),
      url: retrieved.url(),
    };
    const fake = fkTicket();
    let fkNumber: unknown;
    try {
      fkNumber = fake.number();
    } catch (error: unknown) {
      fkNumber = error;
    }
    const expected = {
      assignees: fake.assignees(),
      labels: fake.labels(),
      number: fkNumber,
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

  it('returns present ticket successfully', async () => {
    const number = new Date().getDate();
    const expected: FakeTicket = {
      assignees: [],
      labels: ['wontfix'],
      number,
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
      labels: found.labels(),
      number: found.number(),
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
