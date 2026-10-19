/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ckAllLabels } from '#check/ck-all-labels.ts';
import { ckAnyLabel } from '#check/ck-any-label.ts';
import { ckOk } from '#check/ck-ok.ts';
import { ckRequiredLabels } from '#check/ck-required-labels.ts';

void describe('A required-labels check', { concurrency: true }, () => {
  void it('bypasses when there are no required labels', () => {
    const labels = ['bug', 'question'];
    const required: readonly string[] = [];
    const requiresAll = true;
    const actual = ckRequiredLabels(labels, required, requiresAll);
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const ok = ckOk(
      'Required labels check bypassed as no required labels are specified',
    );
    const bypassed = {
      message: ok.message(),
      reason: ok.reason(),
      valid: ok.valid(),
    };
    assert.deepStrictEqual(
      check,
      bypassed,
      'A required-labels check was executed even though no required labels are specified',
    );
  });

  void it('delegates to all-labels check when requiresAll is true', () => {
    const labels = ['bug', 'help wanted', 'approved'];
    const required: readonly string[] = ['approved', 'assigned'];
    const requiresAll = true;
    const actual = ckRequiredLabels(labels, required, requiresAll);
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const original = ckAllLabels(labels, required);
    const delegated = {
      message: original.message(),
      reason: original.reason(),
      valid: original.valid(),
    };
    assert.deepStrictEqual(
      check,
      delegated,
      'A required-labels check was not delegated to the all-labels check',
    );
  });

  void it('delegates to any-label check when requiresAll is false', () => {
    const labels = ['bug', 'duplicate', 'invalid'];
    const required: readonly string[] = ['approved', 'assigned'];
    const requiresAll = false;
    const actual = ckRequiredLabels(labels, required, requiresAll);
    const check = {
      message: actual.message(),
      reason: actual.reason(),
      valid: actual.valid(),
    };
    const original = ckAnyLabel(labels, required);
    const delegated = {
      message: original.message(),
      reason: original.reason(),
      valid: original.valid(),
    };
    assert.deepStrictEqual(
      check,
      delegated,
      'A required-labels check was not delegated to the any-label check',
    );
  });
});
