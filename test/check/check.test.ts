/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import { REASONS } from '#check/check.ts';

describe('check outcome reason codes', () => {
  it('enumerates canonical check reason identifiers', () => {
    expect(
      REASONS,
      `The check reason codes deviated from canonical identifiers, received ${String(REASONS)}`,
    ).toStrictEqual([
      'ok',
      'no-ticket-found',
      'ticket-not-found',
      'scope-violation',
      'missing-required-label',
      'forbidden-label',
      'status-not-allowed',
      'author-not-assigned',
      'unauthorized',
    ]);
  });
});
