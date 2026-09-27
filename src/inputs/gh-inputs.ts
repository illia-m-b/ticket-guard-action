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

import { Inputs, Scope, SCOPES, Target, TARGETS } from '#inputs/inputs.ts';

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
    const raw = getInput('extract-from') as Target;
    if (!TARGETS.includes(raw)) {
      throw new TypeError(
        `Invalid "extract-from": expected ${TARGETS.join(' | ')}, got "${raw}"`,
      );
    }
    return raw;
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
    const raw = getInput('scope') as Scope;
    if (!SCOPES.includes(raw)) {
      throw new TypeError(
        `Invalid "scope": expected ${SCOPES.join(' | ')}, got "${raw}"`,
      );
    }
    return raw;
  },
});
