/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { FakeTicket } from '#backlog/fk-ticket.ts';

import { fkTicket } from '#backlog/fk-ticket.ts';

void describe('An in-memory ticket instance', { concurrency: true }, () => {
  void it('returns default values when absent', () => {
    const defaults: Omit<FakeTicket, 'id'> = {
      assignees: [],
      labels: [],
      present: false,
      status: '',
      url: '',
    };
    const fake = fkTicket();
    const actual: Omit<FakeTicket, 'id'> = {
      assignees: fake.assignees(),
      labels: fake.labels(),
      present: fake.present(),
      status: fake.status(),
      url: fake.url(),
    };
    assert.deepStrictEqual(
      actual,
      defaults,
      'Unexpected default values were used for absent ticket',
    );
  });

  void it('throws TypeError when reading the id of an absent ticket', () => {
    const fake = fkTicket();
    assert.throws(
      () => fake.id(),
      new TypeError('Ticket is absent'),
      'Accessing an absent ticket was silently permitted',
    );
  });

  void it('uses an empty string when marked as present without overrides', () => {
    const id = fkTicket({ present: true }).id();
    const empty = '';
    assert.equal(
      id,
      empty,
      'A non-empty id was assigned to the fake present ticket',
    );
  });

  void it('preserves custom overrides', () => {
    const custom: FakeTicket = {
      assignees: ['octocat'],
      id: String(Date.now()),
      labels: ['bug'],
      present: true,
      status: 'open',
      url: 'https://github.com/illia-m-b/ticket-guard-action/issues/4',
    };
    const fake = fkTicket(custom);
    const actual: FakeTicket = {
      assignees: fake.assignees(),
      id: fake.id(),
      labels: fake.labels(),
      present: fake.present(),
      status: fake.status(),
      url: fake.url(),
    };
    assert.deepStrictEqual(
      actual,
      custom,
      'Custom overrides were not preserved by the fake ticket instance',
    );
  });
});
