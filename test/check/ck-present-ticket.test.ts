/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import { fkTicket } from '#backlog/fk-ticket.ts';
import { ckFailed } from '#check/ck-failed.ts';
import { ckOk } from '#check/ck-ok.ts';
import { ckPresentTicket } from '#check/ck-present-ticket.ts';

describe('a ticket presence check', () => {
  it('returns a passed check when ticket is present', () => {
    const ticket = fkTicket({ present: true });
    const actual = ckPresentTicket(ticket);
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
      'A ticket presence check failed even though the ticket is present',
    ).toStrictEqual(passed);
  });

  it('returns a failed check when ticket is absent', () => {
    const ticket = fkTicket();
    const actual = ckPresentTicket(ticket);
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const invalid = ckFailed(
      'ticket-not-found',
      'Ticket not found. Check your backlog',
    );
    const failed = {
      message: invalid.message(),
      reason: invalid.reason(),
      valid: invalid.valid(),
    };

    expect(
      check,
      'A ticket presence check passed even though the ticket is absent',
    ).toStrictEqual(failed);
  });
});
