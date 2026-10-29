/*
 * SPDX-FileCopyrightText: 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import {
  getBooleanInput,
  getInput,
  getMultilineInput,
  setSecret,
} from '@actions/core';

import type { Coordinates } from '#coordinates/coordinates.ts';
import type { Grip } from '#grip/grip.ts';

import { ghCoordinates } from '#coordinates/gh-coordinates.ts';
import { stGrip } from '#grip/st-grip.ts';

import type { Inputs } from './inputs.ts';

import { isTarget, TARGETS } from './inputs.ts';

/**
 * Creates an {@link Inputs} instance backed by the GitHub Actions runner
 * environment.
 *
 * Reads values from `@actions/core` and automatically masks sensitive
 * credentials.
 *
 * @param grip - The grip strategy governing evaluation and caching. Defaults to
 *   {@link stGrip}.
 * @param coordinates - The repository coordinates factory. Defaults to
 *   {@link ghCoordinates}.
 *
 * @returns An {@link Inputs} implementation reading from workflow inputs.
 */
export const rtInputs = (
  grip: Grip = stGrip,
  coordinates: (raw: string) => Coordinates = ghCoordinates,
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
    const lines = getMultilineInput('scope')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    if (lines.length === 0) {
      throw new TypeError(
        'Invalid "scope": at least one repository must be specified',
      );
    }
    return lines.map((line) => {
      try {
        return coordinates(line).normalized();
      } catch {
        throw new TypeError(
          `Invalid "scope": expected repository coordinates ("owner/repo"), got "${line}"`,
        );
      }
    });
  }),
});
