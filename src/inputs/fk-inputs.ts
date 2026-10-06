/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Inputs } from '#inputs/inputs.ts';

/**
 * Configuration options for creating a fake {@link Inputs} instance.
 */
export type FakeInputs = {
  readonly [K in keyof Inputs]: Inputs[K] extends (
    ..._arguments: never[]
  ) => unknown
    ? ReturnType<Inputs[K]>
    : never;
};

/**
 * Creates an in-memory {@link Inputs} instance for testing.
 *
 * @param initial - Optional partial values to override default test inputs.
 *
 * @returns A test {@link Inputs} implementation with predetermined values.
 */
export const fkInputs = ({
  allowedStatuses = ['open'],
  extractFrom = ['pr-title', 'pr-body'],
  failOnError = true,
  forbiddenLabels = [],
  gitHubToken = '',
  ignoreActors = ['dependabot[bot]', 'renovate[bot]'],
  requireAllLabels = false,
  requireAuthorAssigned = false,
  requiredLabels = [],
  scope = 'current-repo',
}: Partial<FakeInputs> = {}): Inputs => ({
  allowedStatuses: () => allowedStatuses,
  extractFrom: () => extractFrom,
  failOnError: () => failOnError,
  forbiddenLabels: () => forbiddenLabels,
  gitHubToken: () => gitHubToken,
  ignoreActors: () => ignoreActors,
  requireAllLabels: () => requireAllLabels,
  requireAuthorAssigned: () => requireAuthorAssigned,
  requiredLabels: () => requiredLabels,
  scope: () => scope,
});
