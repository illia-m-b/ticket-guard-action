/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import { fkTicket } from '#backlog/fk-ticket.ts';
import { ckFailed } from '#check/ck-failed.ts';
import { ckOk } from '#check/ck-ok.ts';
import { trPlain } from '#check/tr-plain.ts';

describe('a plain traceability outcome', () => {
  it('delegates check outcome accessors to wrapped check', () => {
    const origin = ckFailed('no-ticket-found', 'Ticket is missing');
    const traceability = trPlain(origin);
    const actual = {
      message: traceability.message(),
      reason: traceability.reason(),
      valid: traceability.valid(),
    };
    const expected = {
      message: origin.message(),
      reason: origin.reason(),
      valid: origin.valid(),
    };
    expect(
      actual,
      'The plain traceability outcome did not delegate accessors to the wrapped check',
    ).toStrictEqual(expected);
  });

  it('exposes custom ticket when provided', () => {
    const origin = ckOk('Validation succeeded');
    const ticket = fkTicket({
      id: '42',
      present: true,
      status: 'open',
      url: 'https://github.com/octo-org/octo-repo/issues/42',
    });
    const traceability = trPlain(origin, ticket);
    expect(
      traceability.ticket(),
      'The plain traceability outcome did not return the provided ticket instance',
    ).toBe(ticket);
  });

  it('defaults to absent ticket when ticket parameter is omitted', () => {
    const origin = ckOk();
    const traceability = trPlain(origin);
    expect(
      traceability.ticket().present(),
      'The plain traceability outcome did not default to an absent ticket',
    ).toBe(false);
  });
});
