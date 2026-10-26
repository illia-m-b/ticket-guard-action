/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import type { FakeTicket } from '#backlog/fk-ticket.ts';

import { fkTicket } from '#backlog/fk-ticket.ts';

describe('an in-memory ticket instance', () => {
  it('returns default values when absent', () => {
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

    expect(
      actual,
      'Unexpected default values were used for absent ticket',
    ).toStrictEqual(defaults);
  });

  it('throws TypeError when reading the id of an absent ticket', () => {
    const fake = fkTicket();

    expect(
      () => fake.id(),
      'Accessing an absent ticket was silently permitted',
    ).toThrow(new TypeError('Ticket is absent'));
  });

  it('uses an empty string when marked as present without overrides', () => {
    const id = fkTicket({ present: true }).id();
    const empty = '';

    expect(id, 'A non-empty id was assigned to the fake present ticket').toBe(
      empty,
    );
  });

  it('preserves custom overrides', () => {
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

    expect(
      actual,
      'Custom overrides were not preserved by the fake ticket instance',
    ).toStrictEqual(custom);
  });
});
