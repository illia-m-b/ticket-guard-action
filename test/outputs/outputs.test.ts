/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import { OUTPUTS } from '#outputs/outputs.ts';

describe('action output parameter names', () => {
  it('enumerates canonical output parameter names', () => {
    expect(
      OUTPUTS,
      `The action output parameters deviated from canonical specification, received ${String(OUTPUTS)}`,
    ).toStrictEqual([
      'error-message',
      'is-valid',
      'ticket-id',
      'ticket-labels',
      'ticket-status',
      'ticket-url',
    ]);
  });
});
