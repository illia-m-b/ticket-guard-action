/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { rfEmpty } from '#reference/rf-empty.ts';

describe('An empty issue reference', { concurrency: true }, () => {
  it('fails when requesting number', () => {
    assert.throws(
      () => rfEmpty().number(),
      { message: 'Reference is empty', name: 'TypeError' },
      'Accessing the number of an empty issue reference was silently allowed',
    );
  });

  it('is never present', () => {
    assert.equal(
      rfEmpty().present(),
      false,
      'An empty issue reference was unexpectedly marked as present',
    );
  });

  it('has an empty raw string', () => {
    assert.equal(
      rfEmpty().raw(),
      '',
      'An empty reference produced a non-empty raw string',
    );
  });
});
