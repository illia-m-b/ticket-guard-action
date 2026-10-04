/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { FakeTicket } from '#backlog/fk-ticket.ts';

import { fkTicket } from '#backlog/fk-ticket.ts';

describe('An in-memory ticket instance', { concurrency: true }, () => {
  it('returns default values when absent', () => {
    const defaults: Omit<FakeTicket, 'number'> = {
      assignees: [],
      labels: [],
      present: false,
      status: '',
      url: '',
    };
    const fake = fkTicket();
    const actual: Omit<FakeTicket, 'number'> = {
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

  it('throws TypeError when reading the number of an absent ticket', () => {
    const fake = fkTicket();
    assert.throws(
      () => fake.number(),
      new TypeError('Ticket is absent'),
      'Accessing an absent ticket was silently permitted',
    );
  });

  it('uses NaN when marked as present without overrides', () => {
    const number = fkTicket({ present: true }).number();
    assert.ok(
      Number.isNaN(number),
      'A non-NaN number was assigned to the fake present ticket',
    );
  });

  it('preserves custom overrides', () => {
    const custom: FakeTicket = {
      assignees: ['octocat'],
      labels: ['bug'],
      number: Date.now(),
      present: true,
      status: 'open',
      url: 'https://github.com/illia-m-b/ticket-guard-action/issues/4',
    };
    const fake = fkTicket(custom);
    const actual: FakeTicket = {
      assignees: fake.assignees(),
      labels: fake.labels(),
      number: fake.number(),
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
