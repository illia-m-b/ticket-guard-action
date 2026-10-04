/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import {
  getBooleanInput,
  getInput,
  getMultilineInput,
  setSecret,
} from '@actions/core';

import type { Inputs } from './inputs.ts';

import { isScope, isTarget, SCOPES, TARGETS } from './inputs.ts';

/**
 * Creates an {@link Inputs} instance backed by the GitHub Actions runner
 * environment.
 *
 * Reads values from `@actions/core` and automatically masks sensitive
 * credentials.
 *
 * @returns An {@link Inputs} implementation reading from workflow inputs.
 */
export const ghInputs = (): Inputs => ({
  allowedStatuses: () => getMultilineInput('allowed-statuses'),
  extractFrom: () => {
    const raw = getMultilineInput('extract-from');
    return raw.map((value) => {
      if (!isTarget(value)) {
        throw new TypeError(
          `Invalid "extract-from": expected (${TARGETS.join(' | ')})[], got "${JSON.stringify(raw)}"`,
        );
      }
      return value;
    });
  },
  failOnError: () => getBooleanInput('fail-on-error'),
  forbiddenLabels: () => getMultilineInput('forbidden-labels'),
  gitHubToken: () => {
    const token = getInput('github-token');
    setSecret(token);
    return token;
  },
  ignoreActors: () => getMultilineInput('ignore-actors'),
  requireAllLabels: () => getBooleanInput('require-all-labels'),
  requireAuthorAssigned: () => getBooleanInput('require-author-assigned'),
  requiredLabels: () => getMultilineInput('required-labels'),
  scope: () => {
    const raw = getInput('scope');
    if (!isScope(raw)) {
      throw new TypeError(
        `Invalid "scope": expected ${SCOPES.join(' | ')}, got "${raw}"`,
      );
    }
    return raw;
  },
});
