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

import { stGrip } from '#grip/st-grip.ts';

import type { Inputs } from './inputs.ts';

import { isScope, isTarget, SCOPES, TARGETS } from './inputs.ts';

/**
 * Creates an {@link Inputs} instance backed by the GitHub Actions runner
 * environment.
 *
 * Reads values from `@actions/core` and automatically masks sensitive
 * credentials.
 *
 * @param grip - The grip strategy governing evaluation and caching. Defaults to
 *   {@link stGrip}.
 *
 * @returns An {@link Inputs} implementation reading from workflow inputs.
 */
export const ghInputs = (
  grip: <T>(origin: () => T) => () => T = stGrip,
): Inputs => ({
  allowedStatuses: grip(() => getMultilineInput('allowed-statuses')),
  extractFrom: grip(() => {
    const raw = getMultilineInput('extract-from');
    return raw.map((value) => {
      if (!isTarget(value)) {
        throw new TypeError(
          `Invalid "extract-from": expected (${TARGETS.join(' | ')})[], got "${JSON.stringify(raw)}"`,
        );
      }
      return value;
    });
  }),
  failOnError: grip(() => getBooleanInput('fail-on-error')),
  forbiddenLabels: grip(() => getMultilineInput('forbidden-labels')),
  gitHubToken: grip(() => {
    const token = getInput('github-token');
    setSecret(token);
    return token;
  }),
  ignoreActors: grip(() => getMultilineInput('ignore-actors')),
  requireAllLabels: grip(() => getBooleanInput('require-all-labels')),
  requireAuthorAssigned: grip(() => getBooleanInput('require-author-assigned')),
  requiredLabels: grip(() => getMultilineInput('required-labels')),
  scope: grip(() => {
    const raw = getInput('scope');
    if (!isScope(raw)) {
      throw new TypeError(
        `Invalid "scope": expected ${SCOPES.join(' | ')}, got "${raw}"`,
      );
    }
    return raw;
  }),
});
