/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Target } from '#inputs/inputs.ts';
import type { PullRequest } from '#pull-request/pull-request.ts';

import type { Reference } from './reference.ts';

import { rfEmpty } from './rf-empty.ts';
import { rfEnvelope } from './rf-envelope.ts';
import { rfGitHub } from './rf-git-hub.ts';

/**
 * Creates an issue {@link Reference} extracted sequentially from a prioritized
 * list of pull request targets.
 *
 * Scans each target in the specified order and returns the first present
 * reference. Evaluation is deferred and memoized through {@link rfEnvelope};
 * pull request fields are only accessed when the returned reference is
 * evaluated.
 *
 * @param targets - The ordered list of target locations to scan.
 * @param pr - The pull request containing the target fields.
 * @param extracted - The reference supplier parsing candidate text. Defaults to
 *   {@link rfGitHub}.
 *
 * @returns The first present {@link Reference}, or {@link rfEmpty} if no
 *   reference is found across targets.
 */
export const rfTargets = (
  targets: readonly Target[],
  pr: PullRequest,
  extracted: (text: string) => Reference = rfGitHub,
): Reference =>
  rfEnvelope(() => {
    for (const target of targets) {
      const text = target === 'pr-title' ? pr.title() : pr.body();
      const reference = extracted(text);
      if (reference.present()) {
        return reference;
      }
    }
    return rfEmpty();
  });
