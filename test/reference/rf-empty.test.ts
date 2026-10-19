/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { rfEmpty } from '#reference/rf-empty.ts';

void describe('An empty issue reference', { concurrency: true }, () => {
  void it('fails when requesting ID', () => {
    assert.throws(
      () => rfEmpty().id(),
      { message: 'Reference is empty', name: 'TypeError' },
      'Accessing the ID of an empty issue reference was silently allowed',
    );
  });

  void it('is never present', () => {
    assert.equal(
      rfEmpty().present(),
      false,
      'An empty issue reference was unexpectedly marked as present',
    );
  });

  void it('has an empty raw string', () => {
    assert.equal(
      rfEmpty().raw(),
      '',
      'An empty reference produced a non-empty raw string',
    );
  });
});
