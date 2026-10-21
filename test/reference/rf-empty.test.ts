/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, it } from 'vitest';

import { rfEmpty } from '#reference/rf-empty.ts';

describe('an empty issue reference', () => {
  it('fails when requesting ID', () => {
    expect(
      () => rfEmpty().id(),
      'Accessing the ID of an empty issue reference was silently allowed',
    ).toThrow(new TypeError('Reference is empty'));
  });

  it('is never present', () => {
    expect(
      rfEmpty().present(),
      'An empty issue reference was unexpectedly marked as present',
    ).toBe(false);
  });

  it('has an empty raw string', () => {
    expect(
      rfEmpty().raw(),
      'An empty reference produced a non-empty raw string',
    ).toBe('');
  });
});
